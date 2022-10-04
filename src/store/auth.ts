import { reactive } from 'vue'
import type { Unsubscribe } from 'firebase/firestore'

import { setOnAuthStateChangedCallback, signOut } from '@/api/auth'
import { subscribeToPosts } from '@/api/posts'
import { fetchUser } from '@/api/user'

import { subscribeToNotifications } from '@/api/notifications'
import { notificationsStore } from './notifications'
import { addToFeed } from './feeds'
import { postsStore } from './posts'

export const authStore = reactive({
  isAuthenticated: false,
  isInitialized: false,
  username: '',
  userId: '',
})

export const getIsMe = (userId: string | undefined) =>
  authStore.userId === userId

let unsubscribeToPosts: Unsubscribe = () => undefined
let unsubscribeToNotifications: Unsubscribe | undefined = () => undefined

export const initializeAuthCallback = () =>
  setOnAuthStateChangedCallback(async (user) => {
    if (user) {
      try {
        const userData = await fetchUser(user.uid)

        if (!userData) {
          await signOut()
          return
        }

        authStore.isAuthenticated = true
        authStore.isInitialized = true
        authStore.username = userData.username
        authStore.userId = user.uid

        unsubscribeToPosts = subscribeToPosts((posts) => {
          posts.forEach((post) => {
            postsStore.posts[post.id] = post
            addToFeed('home', post.id)
          })
        })

        unsubscribeToNotifications = subscribeToNotifications(
          (notifications) => {
            notificationsStore.notifications = notifications
          }
        )
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
