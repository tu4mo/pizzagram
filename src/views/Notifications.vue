<template>
  <DefaultLayout max-width title="Notifications">
    <BaseEmpty v-if="notificationsStore.notifications.length === 0">
      No notifications.
    </BaseEmpty>
    <template v-else>
      <ul
        v-for="(notification, index) in notificationsStore.notifications"
        :key="index"
      >
        <li v-if="notification.type === 'LIKE'" class="notification">
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
            <BaseLink
              :to="{
                name: 'profile',
                params: { username: notification.from.username },
              }"
            >
              {{ notification.from.username }}
            </BaseLink>
            liked your
            <BaseLink
              :to="{ name: 'post', params: { postId: notification.postId } }"
            >
              photo
            </BaseLink>
          </div>
          <PostImage
            v-if="notification.imageUrl"
            class="notification__image"
            :image-url="notification.imageUrl"
            :to="{ name: 'post', params: { postId: notification.postId } }"
            thumbnail
          />
        </li>
      </ul>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { onDeactivated } from 'vue'

  import DefaultLayout from '@/layouts/Default.vue'

  import BaseEmpty from '@/components/BaseEmpty.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'

  import { markNotificationsAsRead } from '@/api/notifications'
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
</script>

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
    border-radius: 0.25rem;
    height: 0.5rem;
    width: 0.5rem;
  }

  .notification__image {
    border-radius: 0.25rem;
    flex: 0 0 auto;
    margin-left: auto;
    overflow: hidden;
    width: 4rem;
    height: 4rem;
  }
</style>
