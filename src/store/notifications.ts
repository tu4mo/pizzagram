import { computed, reactive } from 'vue'

import type { Notification } from '@/api/notifications'

export const notificationsStore = reactive<{
  notifications: Notification[]
}>({
  notifications: [],
})

export const unreadNotificationsCount = computed(() => {
  return notificationsStore.notifications.filter(
    (notification) => !notification.read,
  ).length
})
