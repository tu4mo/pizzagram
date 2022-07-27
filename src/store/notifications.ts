import { reactive } from 'vue'

import { Notification } from '@/api/notifications'

export const notificationsStore = reactive<{
  notifications: Notification[]
  getUnreadNotificationsCount: () => number
}>({
  notifications: [],

  getUnreadNotificationsCount() {
    return this.notifications.filter((notification) => !notification.read)
      .length
  },
})
