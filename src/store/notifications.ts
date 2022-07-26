import { reactive } from 'vue'

export const notificationsStore = reactive({
  notifications: [],

  getUnreadNotificationsCount() {
    return this.notifications.filter((notification) => !notification.read)
      .length
  },
})
