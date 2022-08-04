import { reactive } from 'vue'
import { Unsubscribe } from 'firebase/firestore'

import { setOnAuthStateChangedCallback, signOut } from '@/api/auth'
import { subscribeToPosts } from '@/api/posts'
import { fetchUser } from '@/api/user'

import store from '@/store'
import { subscribeToNotifications } from '@/api/notifications'
import { notificationsStore } from './notifications'
import { feedsStore } from './feeds'

export const authStore = reactive({
  isAuthenticated: false,
  isInitialized: false,
  username: '',
  userId: '',

  getIsMe(userId: string) {
    return this.userId === userId
  },
})

let unsubscribeToPosts: Unsubscribe = () => undefined
let unsubscribeToNotifications: Unsubscribe | undefined = () => undefined

setOnAuthStateChangedCallback(async (user) => {
  if (user) {
    try {
      const userData = await fetchUser(user.uid)

      authStore.isAuthenticated = true
      authStore.isInitialized = true
      authStore.username = userData.username
      authStore.userId = user.uid

      store.commit('addToUsers', userData)

      unsubscribeToPosts = subscribeToPosts((posts) => {
        posts.forEach((post) => {
          store.commit('addToPosts', post)
          feedsStore.addToFeeds('home', post.id)
        })
      })

      unsubscribeToNotifications = subscribeToNotifications((notifications) => {
        notificationsStore.notifications = notifications
      })
    } catch (e) {
      // Sign out if there's an error getting user
      await signOut()
    }
  } else {
    unsubscribeToPosts?.()
    unsubscribeToNotifications?.()

    authStore.isAuthenticated = false
    authStore.isInitialized = true
    authStore.username = ''
    authStore.userId = ''
  }
})
