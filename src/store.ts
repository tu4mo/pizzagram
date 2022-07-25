import Vue from 'vue'
import Vuex from 'vuex'

import { setOnAuthStateChangedCallback, signOut } from './api/auth'
import { toggleLike } from './api/likes'
import {
  getPost,
  getPosts,
  removePost,
  subscribeToPosts,
  QUERY_LIMIT,
} from './api/posts'
import { getUser, getUserByUsername } from './api/user'
import { subscribeToNotifications } from './api/notifications'
import { fetchTopPosters } from './api/top'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    auth: {
      isAuthenticated: false,
      isInitialized: false,
      username: '',
      userId: '',
    },
    isLoading: false,
    isLastPostReached: false,
    feeds: {},
    file: null,
    notifications: [],
    users: {},
    posts: {},
  },

  getters: {
    getUser: (state) => (username) => state.users[username] || {},

    getUserById: (state) => (userId) =>
      Object.values(state.users).find((user) => user.id === userId) || {},

    getIsMe: (state) => (userId) => state.auth.userId === userId,

    getPostById: (state) => (id) => {
      return state.posts[id] ? state.posts[id] : {}
    },

    getPostsByFeed: (state) => (feed) => {
      const postIds = Object.keys(state.feeds[feed] || {})
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

    getNotifications: (state) => state.notifications || [],

    getUnreadNotificationsCount: (state, getters) =>
      getters.getNotifications.filter((notification) => !notification.read)
        .length,
  },

  mutations: {
    setIsAuthenticated(state, { isAuthenticated, username, userId }) {
      state.auth.isAuthenticated = isAuthenticated
      state.auth.isInitialized = true
      state.auth.username = username
      state.auth.userId = userId
    },

    setIsLoading(state, isLoading) {
      state.isLoading = isLoading
    },

    setUser(state, user) {
      state.user = user
    },

    addToFeeds(state, { feed, postId }) {
      state.feeds = {
        ...state.feeds,
        [feed]: { ...(state.feeds[feed] || {}), [postId]: true },
      }
    },

    clearFeed(state, feed) {
      delete state.feeds[feed]
    },

    setFile(state, file) {
      state.file = file
    },

    addToUsers(state, user) {
      state.users = { ...state.users, [user.username]: user }
    },

    addToPosts(state, post) {
      state.posts = { ...state.posts, [post.id]: post }
    },

    removePost(state, postId) {
      Vue.delete(state.posts, postId)
      Object.keys(state.feeds).forEach((feed) => {
        Vue.delete(state.feeds[feed], postId)
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

    setIsLastPostReached(state, isLastPostReached) {
      state.isLastPostReached = isLastPostReached
    },

    setNotifications(state, notifications) {
      state.notifications = notifications
    },
  },

  actions: {
    async getPostById({ commit, state }, { postId, force }) {
      if (state.posts[postId] && !force) {
        return
      }

      const post = await getPost(postId)
      commit('addToPosts', post)
    },

    async getPostsForHome({ commit, getters }) {
      commit('setIsLoading', true)

      const postsInHome = getters.getPostsByFeed('home')
      const lastPost =
        postsInHome.length > 0 ? postsInHome[postsInHome.length - 1].doc : null

      const posts = await getPosts({
        after: lastPost,
      })

      posts.forEach((post) => {
        commit('addToPosts', post)
        commit('addToFeeds', { feed: 'home', postId: post.id })
      })

      commit('setIsLoading', false)

      if (posts.length < QUERY_LIMIT) {
        commit('setIsLastPostReached', true)
      }
    },

    async getPostsByUser({ commit, getters }, username) {
      const user = getters.getUser(username)
      if (Object.keys(user).length) {
        const posts = await getPosts({ userId: user.id })
        posts.forEach((post) => {
          commit('addToPosts', post)
          commit('addToFeeds', { feed: username, postId: post.id })
        })
      }
    },

    removePost({ commit }, postId) {
      removePost(postId)
      commit('removePost', postId)
    },

    async getUser({ commit }, username) {
      const user = await getUserByUsername(username)
      commit('addToUsers', user)
    },

    async getUserById({ commit }, userId) {
      const user = await getUser(userId)
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

let unsubscribeToPosts = () => undefined
let unsubscribeToNotifications = () => undefined

setOnAuthStateChangedCallback(async (user) => {
  if (user) {
    try {
      const userData = await getUser(user.uid)
      store.commit('setIsAuthenticated', {
        isAuthenticated: true,
        username: userData.username,
        userId: user.uid,
      })
      store.commit('addToUsers', userData)

      unsubscribeToPosts = subscribeToPosts((posts) => {
        posts.forEach((post) => {
          store.commit('addToPosts', post)
          store.commit('addToFeeds', { feed: 'home', postId: post.id })
        })
      })

      unsubscribeToNotifications = subscribeToNotifications((notifications) => {
        store.commit('setNotifications', notifications)
      })
    } catch (e) {
      // Sign out if there's an error getting user
      await signOut()
    }
  } else {
    unsubscribeToPosts()
    unsubscribeToNotifications()

    store.commit('setIsAuthenticated', {
      isAuthenticated: false,
      username: '',
    })
  }
})

export default store
