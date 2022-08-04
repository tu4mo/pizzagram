import Vue, { del } from 'vue'
import Vuex from 'vuex'

import { toggleLike } from '@/api/likes'
import { fetchPost, fetchPosts, removePost, QUERY_LIMIT } from '@/api/posts'
import { fetchUser, fetchUserByUsername } from '@/api/user'
import { fetchTopPosters } from '@/api/top'
import { feedsStore } from '@/store/feeds'
import { postsStore } from '@/store/posts'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    users: {},
    posts: {},
  },

  getters: {
    getUser: (state) => (username) => state.users[username] || {},

    getUserById: (state) => (userId) =>
      Object.values(state.users).find((user) => user.id === userId) || {},

    getPostById: (state) => (id) => {
      return state.posts[id] ? state.posts[id] : {}
    },

    getPostsByFeed: (state) => (feed: string) => {
      const postIds = Object.keys(feedsStore.feeds[feed] || {})
      return postIds.length > 0
        ? postIds
            .map((postId) => state.posts[postId])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : []
    },

    getTopPosters: ({ users }) =>
      Object.keys(users)
        .sort((a, b) => users[a].posts + users[b].posts)
        .slice(0, 10),
  },

  mutations: {
    addToUsers(state, user) {
      state.users = { ...state.users, [user.username]: user }
    },

    addToPosts(state, post) {
      state.posts = { ...state.posts, [post.id]: post }
    },

    removePost(state, postId) {
      Vue.delete(state.posts, postId)
      Object.keys(feedsStore.feeds).forEach((feed) => {
        del(feedsStore.feeds[feed], postId)
      })
    },

    toggleLike(state, postId) {
      const likes = state.posts[postId].likes || []
      const { userId } = state.auth

      if (likes.includes(userId)) {
        Vue.set(
          state.posts[postId],
          'likes',
          likes.filter((userId) => userId !== userId)
        )
      } else {
        Vue.set(state.posts[postId], 'likes', [...likes, userId])
      }
    },
  },

  actions: {
    async getPostById({ commit, state }, { postId, force }) {
      if (state.posts[postId] && !force) {
        return
      }

      const post = await fetchPost(postId)
      commit('addToPosts', post)
    },

    async getPostsForHome({ commit, getters }) {
      postsStore.isLoading = true

      const postsInHome = getters.getPostsByFeed('home')
      const lastPost =
        postsInHome.length > 0 ? postsInHome[postsInHome.length - 1].doc : null

      const posts = await fetchPosts({
        after: lastPost,
      })

      posts.forEach((post) => {
        commit('addToPosts', post)
        feedsStore.addToFeeds('home', post.id)
      })

      postsStore.isLoading = false

      if (posts.length < QUERY_LIMIT) {
        postsStore.isLastPostReached = true
      }
    },

    async getPostsByUser({ commit, getters }, username) {
      const user = getters.getUser(username)
      if (Object.keys(user).length) {
        const posts = await fetchPosts({ userId: user.id })
        posts.forEach((post) => {
          commit('addToPosts', post)
          feedsStore.addToFeeds(username, post.id)
        })
      }
    },

    removePost({ commit }, postId) {
      removePost(postId)
      commit('removePost', postId)
    },

    async getUser({ commit }, username) {
      const user = await fetchUserByUsername(username)
      commit('addToUsers', user)
    },

    async getUserById({ commit }, userId) {
      const user = await fetchUser(userId)
      commit('addToUsers', user)
    },

    async toggleLike({ commit }, postId) {
      commit('toggleLike', postId)
      await toggleLike(postId)
    },

    async getTopPosters({ commit }) {
      const topPosters = await fetchTopPosters()
      topPosters.forEach((user) => commit('addToUsers', user))
    },
  },
})

export default store
