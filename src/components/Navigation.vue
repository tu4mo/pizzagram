<script setup lang="ts">
  import { computed } from 'vue'

  import Camera from './Camera.vue'
  import NavItem from './NavItem.vue'

  import { authStore } from '@/store/auth'
  import { getUnreadNotificationsCount } from '@/store/notifications'

  const notifications = computed(() => {
    const unreadNotificationsCount = getUnreadNotificationsCount()
    return unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
  })
</script>

<template>
  <nav class="navigation">
    <div class="navigation__items">
      <NavItem
        :to="{ name: 'home' }"
        class="navigation__item"
        exact
        icon="home"
        title="Home"
      />
      <NavItem icon="camera" :to="{ name: 'upload' }" custom title="Upload">
        <Camera class="navigation__item" />
      </NavItem>
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
    </div>
  </nav>
</template>

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
