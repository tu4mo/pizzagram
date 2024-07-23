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
  </nav>
</template>

<style scoped>
  .navigation {
    align-items: center;
    color: var(--color-secondary);
    display: grid;
    grid-auto-flow: column;
    height: 3.5rem;
    justify-content: space-around;
    width: 100%;
  }

  @media (min-width: 640px) {
    .navigation {
      gap: 1.5rem;
    }
  }
</style>
