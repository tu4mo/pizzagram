<template>
  <RouterLink v-if="!custom" :exact="exact" :to="to" class="nav-item">
    <div class="nav-item__icon">
      <Icon :name="icon" />
      <div v-if="badge" class="nav-item__badge">{{ badge }}</div>
    </div>
    <div class="nav-item__title">{{ title }}</div>
  </RouterLink>
  <template v-else>
    <label
      class="nav-item"
      :aria-current="route.name === to.name ? 'page' : undefined"
    >
      <div class="nav-item__icon">
        <Icon :name="icon" />
      </div>
      <div class="nav-item__title">{{ title }}</div>
      <slot />
    </label>
  </template>
</template>

<script setup lang="ts">
  import { type RouteLocationNamedRaw, useRoute } from 'vue-router'

  import Icon from './Icon.vue'

  type Props = {
    badge?: number | string
    custom?: boolean
    exact?: boolean
    icon: InstanceType<typeof Icon>['$props']['name']
    title: string
    to: RouteLocationNamedRaw
  }

  defineProps<Props>()

  const route = useRoute()
</script>

<style scoped>
  .nav-item {
    color: var(--color-secondary);
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    position: relative;
    text-decoration: none;
    transition: transform var(--transition-fast);
  }

  .nav-item:active {
    transform: var(--button-scale);
  }

  [aria-current='page'] {
    color: var(--color-primary);
  }

  .nav-item__icon {
    position: relative;
  }

  .nav-item__badge {
    align-items: center;
    background-color: var(--color-primary);
    border-radius: var(--radius-md);
    color: #fff;
    display: flex;
    font-size: var(--font-size-sm);
    height: 1rem;
    justify-content: center;
    line-height: 1;
    min-width: 1rem;
    padding: 0 0.25rem;
    position: absolute;
    right: -0.25rem;
    top: -0.25rem;
  }

  .nav-item__title {
    display: none;
    font-weight: bold;
  }

  @media (min-width: 1024px) {
    .nav-item__title {
      display: block;
    }
  }
</style>
