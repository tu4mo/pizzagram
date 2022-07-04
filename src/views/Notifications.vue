<template>
  <DefaultLayout max-width>
    <BaseEmpty v-if="notifications.length === 0">No notifications.</BaseEmpty>
    <template v-else>
      <ul v-for="(notification, index) in notifications" :key="index">
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

<script lang="ts">
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    onDeactivated,
  } from 'vue'

  import DefaultLayout from '@/layouts/Default.vue'

  import BaseEmpty from '@/components/BaseEmpty.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'

  import { markNotificationsAsRead } from '@/api/notifications'

  export default defineComponent({
    components: {
      BaseEmpty,
      BaseLink,
      DefaultLayout,
      PostImage,
      ProfilePhoto,
    },
    setup() {
      const instance = getCurrentInstance()

      const notifications = computed(
        () => instance?.proxy.$store.getters.getNotifications
      )

      onDeactivated(async () => {
        if (instance?.proxy.$store.getters.getUnreadNotificationsCount > 0) {
          await markNotificationsAsRead()
        }
      })

      return { notifications }
    },
  })
</script>

<style lang="scss" scoped>
  .notification {
    align-items: center;
    display: flex;
    gap: 1rem;
    padding: 1rem;

    @media (min-width: 640px) {
      padding: 2rem;
    }

    &__date {
      align-items: center;
      display: flex;
      gap: 0.5rem;
      color: var(--color-gray);
    }

    &__unread {
      background-color: var(--color-primary);
      border-radius: 0.25rem;
      height: 0.5rem;
      width: 0.5rem;
    }

    &__image {
      border-radius: 0.25rem;
      flex: 0 0 auto;
      margin-left: auto;
      overflow: hidden;
      width: 4rem;
      height: 4rem;
    }
  }
</style>
