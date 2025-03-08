import type { Unsubscribe } from 'firebase/firestore'
import { reactive } from 'vue'

import { notificationsStore } from './notifications'

import { setOnAuthStateChangedCallback, signOut } from '@/api/auth'
import { subscribeToNotifications } from '@/api/notifications'
import { fetchUser } from '@/api/user'

export const authStore = reactive({
  isAuthenticated: false,
  isInitialized: false,
  userId: '',
  username: '',
})

export const getIsMe = (userId: string | undefined) =>
  authStore.userId === userId

let unsubscribeToNotifications: Unsubscribe | undefined = () => undefined

export function initializeAuth() {
  setOnAuthStateChangedCallback(async (user) => {
    if (user) {
      try {
        const userData = await fetchUser(user.uid)

        if (!userData) {
          await signOut()
          return
        }

        authStore.isAuthenticated = true
        authStore.userId = user.uid
        authStore.username = userData.username

        unsubscribeToNotifications = await subscribeToNotifications(
          (notifications) => {
            notificationsStore.notifications = notifications
          },
        )
      } catch {
        // Sign out if there's an error getting user
        await signOut()
      }
    } else {
      unsubscribeToNotifications?.()

      authStore.isAuthenticated = false
      authStore.userId = ''
      authStore.username = ''
    }

    authStore.isInitialized = true
  })
}
