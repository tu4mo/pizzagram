import { reactive } from 'vue'

import * as api from '@/api/posts'
import { addToFeed, feedsStore } from './feeds'
import { fetchUserByUsername } from '@/api/user'
import { authStore } from './auth'

export const postsStore = reactive<{
  isLoading: boolean
  isLastPostReached: boolean
  posts: { [key: string]: api.Post }
}>({
  isLoading: false,
  isLastPostReached: false,
  posts: {},
})

export const getPost = async (id: string, force = false) => {
  if (postsStore.posts[id] && !force) {
    return postsStore.posts[id]
  }

  const post = await api.fetchPost(id)

  if (post) {
    postsStore.posts = {
      ...postsStore.posts,
      [post.id]: post,
    }
  }

  return post
}

export const getPostsByFeed = (feed?: string) => {
  if (!feed) {
    return []
  }

  const postIds = Object.keys(feedsStore.feeds[feed] || {})
  return postIds.length > 0
    ? postIds
        .map((postId) => postsStore.posts[postId])
        .filter(Boolean)
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : []
}

export const fetchPostsForHome = async () => {
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

export const fetchPostsForUser = async (username: string) => {
  const user = await fetchUserByUsername(username)
  if (Object.keys(user).length) {
    const posts = await api.fetchPosts({ userId: user.id })
    posts.forEach((post) => {
      postsStore.posts = { ...postsStore.posts, [post.id]: post }
      addToFeed(username, post.id)
    })
  }
}

export const removePost = async (id: string) => {
  await api.removePost(id)

  delete postsStore.posts[id]

  Object.keys(feedsStore.feeds).forEach((feed) => {
    delete feedsStore.feeds[feed][id]
  })
}

export const toggleLike = async (postId: string) => {
  const likes = postsStore.posts[postId].likes || []
  const userId = authStore.userId

  if (likes.includes(userId)) {
    postsStore.posts[postId].likes = likes.filter((userId) => userId !== userId)
  } else {
    postsStore.posts[postId].likes = [...likes, userId]
  }

  await api.toggleLike(postId)
}
