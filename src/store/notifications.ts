import { computed, ref } from 'vue'

import type { Notification } from '@/api/notifications'

export const notificationsStore = ref<{
  notifications: Notification[]
}>({
  notifications: [],
})

export const unreadNotificationsCount = computed(
  () =>
    notificationsStore.value.notifications.filter(
      (notification) => !notification.read,
    ).length,
)
