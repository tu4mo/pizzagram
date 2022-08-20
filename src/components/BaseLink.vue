<template>
  <RouterLink :active-class="activeClass" :to="to" class="link">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
  defineProps({
    activeClass: {
      default: null,
      type: String,
    },
    to: {
      required: true,
      type: Object,
    },
  })
</script>

<style scoped>
  .link {
    color: var(--color-primary);
    text-decoration: none;
  }
</style>
