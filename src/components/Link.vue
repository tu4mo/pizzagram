<script setup lang="ts">
  import type { RouterLinkProps } from 'vue-router'

  const { to } = defineProps<{ to: RouterLinkProps['to'] }>()
</script>

<template>
  <RouterLink :to="to" class="link">
    <slot />
  </RouterLink>
</template>

<style scoped>
  .link {
    color: var(--color-primary);
    text-decoration: none;
  }
</style>
