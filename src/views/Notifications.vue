<template>
  <DefaultLayout max-width>
    <BaseEmpty v-if="notifications.length === 0">No notifications.</BaseEmpty>
    <template v-else>
      <ul v-for="(notification, index) in notifications" :key="index">
        <li v-if="notification.type === 'LIKE'" class="notification">
          <ProfilePhoto
            class="notification__profile"
            :gravatar="notification.from.gravatar"
          />
          <div>
            <div class="notification__date">
              {{ notification.createdAt.toLocaleDateString() }}
            </div>
            {{ notification.from.username }} liked your
            <BaseLink
              :to="{ name: 'post', params: { postId: notification.postId } }"
            >
              photo
            </BaseLink>
          </div>
        </li>
      </ul>
      <BaseButton @click="onMarkAllAsReadClick">Mark All as Read</BaseButton>
    </template>
  </DefaultLayout>
</template>

<script>
  import DefaultLayout from "@/layouts/Default";

  import BaseButton from "@/components/BaseButton";
  import BaseEmpty from "@/components/BaseEmpty";
  import BaseLink from "@/components/BaseLink";
  import ProfilePhoto from "@/components/ProfilePhoto";

  import Firebase from "@/firebase";

  export default {
    components: {
      BaseButton,
      BaseEmpty,
      BaseLink,
      DefaultLayout,
      ProfilePhoto
    },
    computed: {
      notifications() {
        return this.$store.getters.getNotifications;
      }
    },
    methods: {
      async onMarkAllAsReadClick() {
        await Firebase.markNotificationsAsRead();
      }
    }
  };
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
  }
</style>
