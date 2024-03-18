<template>
  <RouterLink :to="to" class="link">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router'

  type Props = {
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
