<script setup lang="ts">
  const { component = 'button', secondary = false } = defineProps<{
    secondary?: boolean
    component?: string
  }>()
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    :class="['button', { [`button--secondary`]: secondary }]"
  >
    <slot />
  </component>
</template>

<style scoped>
  .button {
    background-color: transparent;
    border: 0;
    border-radius: var(--radius-sm);
    color: var(--color-primary);
    cursor: pointer;
    display: block;
    font-size: var(--font-size-md);
    font-weight: bold;
    line-height: 3rem;
    -webkit-tap-highlight-color: transparent;
    text-align: center;
    text-decoration: none;
    transition: transform var(--transition-fast);
    width: 100%;
  }

  .button:disabled {
    opacity: 0.5;
  }

  /* Disabled due to Chrome bug
  .button:not(:disabled):active {
    transform: var(--button-scale);
  } */

  .button--secondary {
    color: var(--color-secondary);
  }
</style>
