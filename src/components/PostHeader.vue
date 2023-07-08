<template>
  <header class="post-header">
    <component
      :is="isUserLoaded ? 'RouterLink' : 'div'"
      :to="
        isUserLoaded
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
    <div class="post-header__created-date">{{ createdDate }}</div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import ProfilePhoto from './ProfilePhoto.vue'

  const props = defineProps({
    createdAt: {
      required: true,
      type: Date,
    },
    user: {
      default: () => ({}),
      type: Object,
    },
  })

  const createdDate = computed(() => props.createdAt.toLocaleDateString())
  const isUserLoaded = computed(
    () => props.user && Object.keys(props.user).length > 0,
  )
</script>

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

  .post-header__created-date {
    color: var(--color-gray);
  }

  @media (min-width: 640px) {
    .post-header__profile {
      margin-right: 1rem;
    }
  }
</style>
