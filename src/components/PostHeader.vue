<script setup lang="ts">
  import { computed } from 'vue'

  import PostCreated from './PostCreated.vue'
  import ProfilePhoto from './ProfilePhoto.vue'

  import type { User } from '@/api/user'

  const { createdAt, user = null } = defineProps<{
    createdAt: Date | undefined
    user?: User | null
  }>()

  const isUserLoaded = computed(() => user && Object.keys(user).length > 0)
</script>

<template>
  <header class="post-header">
    <component
      :is="isUserLoaded ? 'RouterLink' : 'div'"
      :to="
        isUserLoaded && user
          ? { name: 'profile', params: { username: user.username } }
          : null
      "
      class="post-header__user"
    >
      <div class="post-header__profile">
        <ProfilePhoto :user="user" />
      </div>
      <div class="post-header__username">{{ user ? user.username : null }}</div>
    </component>
    <PostCreated v-if="createdAt" :created-at="createdAt" />
  </header>
</template>

<style scoped>
  .post-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .post-header__user {
    align-items: center;
    color: var(--color-secondary);
    display: flex;
    font-weight: bold;
    text-decoration: none;
  }

  .post-header__profile {
    margin-right: 0.5rem;
  }

  @media (min-width: 640px) {
    .post-header__profile {
      margin-right: 1rem;
    }
  }
</style>
