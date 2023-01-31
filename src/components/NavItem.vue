<template>
  <RouterLink
    :exact="exact"
    :to="to"
    active-class="nav-item--active"
    class="nav-item"
  >
    <BaseIcon :name="icon" />
    <div v-if="badge" class="nav-item__badge">{{ badge }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
  import BaseIcon from './BaseIcon.vue'

  defineProps({
    badge: {
      default: null,
      type: [Number, String],
    },
    exact: {
      default: false,
      type: Boolean,
    },
    icon: {
      required: true,
      type: String,
    },
    to: {
      required: true,
      type: Object,
    },
  })
</script>

<style scoped>
  .nav-item {
    color: var(--color-secondary);
    padding: 0.5rem;
    position: relative;
    transition: transform var(--transition-fast);
  }

  .nav-item:active {
    transform: scale(0.9);
  }

  .nav-item--active {
    color: var(--color-primary);
  }

  .nav-item__badge {
    align-items: center;
    background-color: var(--color-primary);
    border-radius: 1rem;
    color: #fff;
    display: flex;
    font-size: var(--font-size-sm);
    height: 1rem;
    justify-content: center;
    line-height: 1;
    min-width: 1rem;
    padding: 0 0.25rem;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
