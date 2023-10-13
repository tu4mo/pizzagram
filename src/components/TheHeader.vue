<template>
  <header :class="['header', { 'header--has-title': !!title }]">
    <TheLogo class="header__logo" />
    <div v-if="title" class="header__title">{{ title }}</div>
  </header>
</template>

<script setup lang="ts">
  import TheLogo from './TheLogo.vue'

  type Props = {
    title?: string
  }

  defineProps<Props>()
</script>

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

  .header--has-title .header__logo {
    display: none;
  }

  @media (min-width: 640px) {
    .header {
      justify-content: flex-start;
    }

    .header__title {
      margin-top: 2px;
    }

    .header--has-title .header__logo {
      display: block;
      margin-right: 1rem;
    }
  }
</style>
