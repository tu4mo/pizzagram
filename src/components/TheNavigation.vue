<template>
  <nav class="navigation">
    <div class="navigation__items">
      <template v-if="authStore.isAuthenticated">
        <NavItem
          :to="{ name: 'home' }"
          class="navigation__item"
          exact
          icon="home"
          title="Home"
        />
        <NavItem icon="camera" :to="{ name: 'upload' }" custom title="Upload">
          <TheCamera class="navigation__item" />
        </NavItem>
        <NavItem
          v-if="isDevelopment"
          :to="{ name: 'top' }"
          class="navigation__item"
          exact
          icon="star"
          title="Top Posts"
        />
        <NavItem
          :badge="notifications"
          :to="{ name: 'notifications' }"
          class="navigation__item"
          exact
          icon="bell"
          title="Notifications"
        />
        <NavItem
          :to="{
            name: 'profile',
            params: { username: authStore.username || null },
          }"
          class="navigation__item"
          exact
          icon="user"
          title="Profile"
        />
      </template>
      <template v-else>
        <NavItem
          :to="{ name: 'login' }"
          class="navigation__item"
          exact
          icon="user"
          title="Log In"
        />
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import NavItem from './NavItem.vue'
  import TheCamera from './TheCamera.vue'

  import { authStore } from '@/store/auth'
  import { getUnreadNotificationsCount } from '@/store/notifications'

  const notifications = computed(() => {
    const unreadNotificationsCount = getUnreadNotificationsCount()
    return unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
  })

  const isDevelopment = process.env.NODE_ENV === 'development'
</script>

<style scoped>
  .navigation {
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;
  }

  .navigation__items {
    align-items: center;
    color: var(--color-secondary);
    display: grid;
    grid-auto-flow: column;
    height: 3.5rem;
    justify-content: space-around;
  }

  @media (min-width: 640px) {
    .navigation {
      padding-bottom: 0;
    }

    .navigation__items {
      gap: 1.5rem;
    }
  }
</style>
