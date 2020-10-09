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
              {{ notification.createdAt.toLocaleDateString() }}
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
          <div v-if="!notification.read" class="notification__unread" />
        </li>
      </ul>
    </template>
  </DefaultLayout>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    onDeactivated,
  } from '@vue/composition-api'

  import DefaultLayout from '@/layouts/Default.vue'

  import BaseEmpty from '@/components/BaseEmpty.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'

  import { markNotificationsAsRead } from '@/api/notifications'

  export default defineComponent({
    components: {
      BaseEmpty,
      BaseLink,
      DefaultLayout,
      ProfilePhoto,
    },
    setup(props, context) {
      const notifications = computed(
        () => context.root.$store.getters.getNotifications
      )

      onDeactivated(async () => {
        if (context.root.$store.getters.getUnreadNotificationsCount > 0) {
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
    padding: 1rem;

    @media (min-width: 640px) {
      padding: 2rem;
    }

    &__profile {
      margin-right: 1rem;
    }

    &__date {
      color: var(--color-gray);
    }

    &__unread {
      background-color: var(--color-primary);
      border-radius: 0.25rem;
      height: 0.5rem;
      margin-left: auto;
      width: 0.5rem;
    }
  }
</style>
