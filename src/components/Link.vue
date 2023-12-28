<template>
  <RouterLink :active-class="activeClass" :to="to" class="link">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router'

  type Props = {
    activeClass?: string
    to: RouteLocationRaw
  }

  defineProps<Props>()
</script>

<style scoped>
  .link {
    color: var(--color-primary);
    text-decoration: none;
  }
</style>
