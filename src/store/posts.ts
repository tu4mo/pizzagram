/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { reactive } from 'vue'

import { authStore } from './auth'

import { dislikePost, likePost } from '@/api/likes'
import * as api from '@/api/posts'

export const postsStore = reactive<{
  isLoading: boolean
  lastHomePost: api.Post | null
  posts: { [key: string]: api.Post }
}>({
  isLoading: false,
  lastHomePost: null,
  posts: {},
})

api.subscribeToPosts((posts) => {
  posts.forEach((post) => {
    postsStore.posts[post.id] = post
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
    .map((postId) => postsStore.posts[postId])
    .filter((post) => post !== undefined)
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
}

export async function fetchPostsForHome() {
  postsStore.isLoading = true

  const posts = await api.fetchPosts(postsStore.lastHomePost?.doc)
  postsStore.lastHomePost = posts.at(-1) ?? null

  posts.forEach((post) => {
    postsStore.posts[post.id] = post
  })

  postsStore.isLoading = false
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
    await dislikePost(postId)
  } else {
    try {
      if (postsStore.posts[postId]) {
        postsStore.posts[postId].likes[userId] = true
      }
      await likePost(postId)
    } catch (error) {
      if (postsStore.posts[postId]) {
        postsStore.posts[postId].likes[userId] = false
      }
      console.error(error)
    }
  }
}
