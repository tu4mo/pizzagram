/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { reactive } from 'vue'

import { authStore } from './auth'

import * as api from '@/api/posts'
import { fetchUserByUsername } from '@/api/user'

type Post = api.Post & { isHome?: boolean }

export const postsStore = reactive<{
  isLoading: boolean
  posts: { [key: string]: Post }
}>({
  isLoading: false,
  posts: {},
})

api.subscribeToPosts((posts) => {
  posts.forEach((post) => {
    postsStore.posts[post.id] = {
      ...post,
      isHome: true,
    }
  })
})

export async function getPost(id: string) {
  if (postsStore.posts[id]) {
    return postsStore.posts[id]
  }

  const post = await api.fetchPost(id)

  if (post) {
    postsStore.posts[post.id] = post
    return postsStore.posts[post.id]
  }
}

export function getPostsForHome() {
  const postIds = Object.keys(postsStore.posts)
  return postIds
    .map((postId) => postsStore.posts[postId] as Post)
    .filter((post) => post.isHome)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
}

export function getPosts(userId: string) {
  const postIds = Object.keys(postsStore.posts)
  const posts = postIds
    .map((postId) => postsStore.posts[postId] as api.Post)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

  return posts.filter((post) => post.userId === userId)
}

export async function fetchPostsForHome() {
  postsStore.isLoading = true

  const lastPostInHome = getPostsForHome().at(-1)?.doc ?? undefined

  const posts = await api.fetchPosts({
    after: lastPostInHome,
  })

  posts.forEach((post) => {
    postsStore.posts[post.id] = { ...post, isHome: true }
  })

  postsStore.isLoading = false
}

export async function fetchPostsForUser(username: string) {
  const user = await fetchUserByUsername(username)

  if (!user) {
    return
  }

  const posts = await api.fetchPosts({ userId: user.id })
  posts.forEach((post) => {
    postsStore.posts[post.id] = post
  })
}

export async function removePost(id: string) {
  await api.removePost(id)
  delete postsStore.posts[id]
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
