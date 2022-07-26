<template>
  <nav class="navigation">
    <div class="navigation__items">
      <template v-if="authStore.isAuthenticated">
        <NavItem
          :to="{ name: 'home' }"
          class="navigation__item"
          exact
          icon="home"
        >
          Home
        </NavItem>
        <TheCamera class="navigation__item" />
        <NavItem
          v-if="isDevelopment"
          :to="{ name: 'top' }"
          class="navigation__item"
          exact
          icon="star"
        >
          Top Posts
        </NavItem>
        <NavItem
          :badge="notifications"
          :to="{ name: 'notifications' }"
          class="navigation__item"
          exact
          icon="bell"
        >
          Notifications
        </NavItem>
        <NavItem
          :to="{
            name: 'profile',
            params: { username: authStore.username || null },
          }"
          class="navigation__item"
          exact
          icon="user"
        >
          Profile
        </NavItem>
      </template>
      <template v-else>
        <NavItem
          :to="{ name: 'login' }"
          class="navigation__item"
          exact
          icon="user"
        >
          Log In
        </NavItem>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import NavItem from './NavItem.vue'
  import TheCamera from './TheCamera.vue'
  import { authStore } from '@/store/auth'
  import { notificationsStore } from '@/store/notifications'

  const notifications = computed(() => {
    const unreadNotificationsCount =
      notificationsStore.getUnreadNotificationsCount()

    return unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
  })

  const isDevelopment = computed(() => process.env.NODE_ENV === 'development')
</script>

<style lang="scss" scoped>
  .navigation {
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;

    @media (min-width: 640px) {
      padding-bottom: 0;
    }

    &__items {
      align-items: center;
      color: var(--color-secondary);
      display: grid;
      grid-auto-flow: column;
      height: 3.5rem;
      justify-content: space-around;

      @media (min-width: 640px) {
        gap: 1.5rem;
      }
    }
  }
</style>
