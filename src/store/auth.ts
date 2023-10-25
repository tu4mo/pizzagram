import type { Unsubscribe } from 'firebase/firestore'
import { reactive } from 'vue'

import { addToFeed } from './feeds'
import { notificationsStore } from './notifications'
import { postsStore } from './posts'

import { setOnAuthStateChangedCallback, signOut } from '@/api/auth'
import { subscribeToNotifications } from '@/api/notifications'
import { subscribeToPosts } from '@/api/posts'
import { fetchUser } from '@/api/user'

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

export function initializeAuthCallback() {
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

        unsubscribeToNotifications = await subscribeToNotifications(
          (notifications) => {
            notificationsStore.notifications = notifications
          },
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
}
