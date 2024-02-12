/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { reactive } from 'vue'

import { authStore } from './auth'
import { addToFeed, feedsStore } from './feeds'

import * as api from '@/api/posts'
import { fetchUserByUsername } from '@/api/user'

export const postsStore = reactive<{
  isLoading: boolean
  isLastPostReached: boolean
  posts: { [key: string]: api.Post }
}>({
  isLoading: false,
  isLastPostReached: false,
  posts: {},
})

export async function getPost(id: string, force = false) {
  if (postsStore.posts[id] && !force) {
    return postsStore.posts[id]
  }

  const post = await api.fetchPost(id)

  if (post) {
    postsStore.posts[post.id] = post
    return postsStore.posts[post.id]
  }
}

export function getPostsByFeed(feed?: string) {
  if (!feed) {
    return []
  }

  const postIds = Object.keys(feedsStore.feeds[feed] || {})
  return postIds
    .map((postId) => postsStore.posts[postId])
    .filter(Boolean)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
}

export async function fetchPostsForHome() {
  postsStore.isLoading = true

  const postsInHome = getPostsByFeed('home')
  const lastPost =
    postsInHome.length > 0 ? postsInHome[postsInHome.length - 1].doc : undefined

  const posts = await api.fetchPosts({
    after: lastPost,
  })

  posts.forEach((post) => {
    postsStore.posts = { ...postsStore.posts, [post.id]: post }
    addToFeed('home', post.id)
  })

  postsStore.isLoading = false

  if (posts.length < api.QUERY_LIMIT) {
    postsStore.isLastPostReached = true
  }
}

export async function fetchPostsForUser(username: string) {
  const user = await fetchUserByUsername(username)
  if (Object.keys(user).length) {
    const posts = await api.fetchPosts({ userId: user.id })
    posts.forEach((post) => {
      postsStore.posts = { ...postsStore.posts, [post.id]: post }
      addToFeed(username, post.id)
    })
  }
}

export async function removePost(id: string) {
  await api.removePost(id)

  delete postsStore.posts[id]

  Object.keys(feedsStore.feeds).forEach((feed) => {
    delete feedsStore.feeds[feed][id]
  })
}

export async function toggleLike(postId: string) {
  const likes = postsStore.posts[postId]?.likes ?? {}
  const userId = authStore.userId

  if (userId in likes) {
    delete likes[userId]
    await api.dislikePost(postId)
  } else {
    try {
      postsStore.posts[postId].likes[userId] = true
      await api.likePost(postId)
    } catch (error) {
      postsStore.posts[postId].likes[userId] = false
      console.error(error)
    }
  }
}
