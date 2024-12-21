<script setup lang="ts">
  import { onDeactivated } from 'vue'

  import {
    markNotificationsAsRead,
    type NotificationType,
  } from '@/api/notifications'
  import Empty from '@/components/Empty.vue'
  import Link from '@/components/Link.vue'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import {
    getUnreadNotificationsCount,
    notificationsStore,
  } from '@/store/notifications'
  import { setTitle } from '@/title'

  setTitle('Notifications')

  onDeactivated(async () => {
    if (getUnreadNotificationsCount() > 0) {
      await markNotificationsAsRead()
    }
  })

  function getNotificationVerb(notificationType: NotificationType) {
    switch (notificationType) {
      case 'COMMENT':
        return 'commented on'
      case 'LIKE':
        return 'liked'
      default:
        return ''
    }
  }
</script>

<template>
  <DefaultLayout max-width title="Notifications">
    <Empty v-if="notificationsStore.notifications.length === 0">
      No notifications.
    </Empty>
    <template v-else>
      <ul
        v-for="(notification, index) in notificationsStore.notifications"
        :key="index"
      >
        <li
          v-if="notification.type === 'LIKE' || notification.type === 'COMMENT'"
          class="notification"
        >
          <ProfilePhoto
            as-link
            class="notification__profile"
            :user="notification.from"
          />
          <div>
            <div class="notification__date">
              <div>
                {{ notification.createdAt.toLocaleDateString() }}
              </div>
              <div v-if="!notification.read" class="notification__unread" />
            </div>
            <Link
              :to="{
                name: 'profile',
                params: { username: notification.from.username },
              }"
            >
              {{ notification.from.username }}
            </Link>
            {{ getNotificationVerb(notification.type) }} your
            <Link
              :to="{
                name: 'post',
                params: {
                  username: notification.to.username,
                  postId: notification.postId,
                },
              }"
            >
              photo
            </Link>
          </div>
          <PostImage
            v-if="notification.imageUrl"
            class="notification__image"
            :image-url="notification.imageUrl"
            :to="{
              name: 'post',
              params: {
                username: notification.to.username,
                postId: notification.postId,
              },
            }"
            thumbnail
          />
        </li>
      </ul>
    </template>
  </DefaultLayout>
</template>

<style scoped>
  .notification {
    align-items: center;
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  @media (min-width: 640px) {
    .notification {
      padding: 2rem;
    }
  }

  .notification__date {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    color: var(--color-gray);
  }

  .notification__unread {
    background-color: var(--color-primary);
    border-radius: var(--radius-xs);
    height: 0.5rem;
    width: 0.5rem;
  }

  .notification__image {
    border-radius: var(--radius-xs);
    flex: 0 0 auto;
    margin-left: auto;
    overflow: hidden;
    width: 4rem;
    height: 4rem;
  }
</style>
