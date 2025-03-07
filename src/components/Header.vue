<script setup lang="ts">
  import Logo from './Logo.vue'

  type Props = {
    title?: string
  }

  defineProps<Props>()
</script>

<template>
  <h1 class="header">
    <Logo :aria-hidden="!!title" class="header__logo" />
    <div v-if="title" class="header__title">{{ title }}</div>
  </h1>
</template>

<style scoped>
  .header {
    align-items: center;
    display: flex;
    font-weight: bold;
    height: 4rem;
    justify-content: center;
  }

  .header__logo {
    height: 2.5rem;
  }

  .header__title {
    font-size: var(--font-size-md);
  }

  .header:has(.header__title) .header__logo {
    display: none;
  }

  @media (min-width: 640px) {
    .header {
      justify-content: flex-start;
    }

    .header__title {
      margin-top: 2px;
    }

    .header:has(.header__title) .header__logo {
      display: block;
      margin-right: 1rem;
    }
  }
</style>
