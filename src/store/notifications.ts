import { reactive } from 'vue'

import type { Notification } from '@/api/notifications'

export const notificationsStore = reactive<{
  notifications: Notification[]
}>({
  notifications: [],
})

export const getUnreadNotificationsCount = () =>
  notificationsStore.notifications.filter((notification) => !notification.read)
    .length
