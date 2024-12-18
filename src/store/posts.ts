import { reactive } from 'vue'

import { authStore } from './auth'

import { dislikePost, likePost } from '@/api/likes'
import * as api from '@/api/posts'

export const postsStore = reactive<{
  isLoading: boolean
  posts: { [key: string]: api.Post }
}>({
  isLoading: false,
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

  const lastPostInHome = getPostsForHome().at(-1)?.doc ?? undefined
  const posts = await api.fetchPosts(lastPostInHome)

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
