<script setup lang="ts">
  import { computed } from 'vue'

  import type { User } from '@/api/user'
  import { EMPTY_IMAGE } from '@/consts'

  const {
    asLink,
    size = 'small',
    user = null,
  } = defineProps<{
    asLink?: boolean
    size?: string
    user?: User | null
  }>()

  const classes = computed(() => ['profile-photo', `profile-photo--${size}`])

  const username = computed(() => (user ? user.username : ''))

  const profileUrl = computed(() =>
    user?.gravatar
      ? `https://www.gravatar.com/avatar/${user.gravatar}?d=identicon&s=256`
      : EMPTY_IMAGE,
  )
</script>

<template>
  <RouterLink
    v-if="asLink"
    :to="{ name: 'profile', params: { username: username } }"
  >
    <img :alt="username" :class="classes" :src="profileUrl" loading="lazy" />
  </RouterLink>
  <img
    v-else
    :alt="username"
    :class="classes"
    :src="profileUrl"
    loading="lazy"
  />
</template>

<style scoped>
  .profile-photo {
    background-color: var(--color-light);
    border-radius: 50%;
    display: block;
    object-fit: cover;
  }

  .profile-photo--small {
    height: 2rem;
    width: 2rem;
  }

  .profile-photo--medium {
    height: 4rem;
    width: 4rem;
  }

  .profile-photo--large {
    height: 8rem;
    width: 8rem;
  }

  @media (min-width: 640px) {
    .profile-photo--small {
      height: 4rem;
      width: 4rem;
    }

    .profile-photo--medium {
      height: 8rem;
      width: 8rem;
    }

    .profile-photo--large {
      height: 16rem;
      width: 16rem;
    }
  }
</style>
