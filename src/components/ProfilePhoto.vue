<template>
  <RouterLink
    v-if="asLink"
    :to="{ name: 'profile', params: { username: username } }"
  >
    <img :alt="username" :class="classes" :src="profileUrl" />
  </RouterLink>
  <img v-else :alt="username" :class="classes" :src="profileUrl" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import type { User } from '@/api/user'

  type Props = {
    asLink?: boolean
    size?: string
    user?: User | null
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'small',
    user: null,
  })

  const classes = computed(() => [
    'profile-photo',
    `profile-photo--${props.size}`,
  ])

  const username = computed(() => (props.user ? props.user.username : ''))

  const profileUrl = computed(() =>
    props.user?.gravatar
      ? `https://www.gravatar.com/avatar/${props.user.gravatar}?d=identicon&s=256`
      : undefined,
  )
</script>

<style scoped>
  .profile-photo {
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
