<template>
  <component
    :is="component"
    v-bind="$attrs"
    :class="['button', { [`button--secondary`]: secondary }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  type Props = {
    secondary: boolean
    component: string
  }

  withDefaults(defineProps<Props>(), {
    secondary: false,
    component: 'button',
  })
</script>

<style scoped>
  .button {
    background-color: transparent;
    border: 0;
    border-radius: 0.5rem;
    color: var(--color-primary);
    cursor: pointer;
    font-size: var(--font-size-md);
    font-weight: bold;
    display: block;
    line-height: 3rem;
    text-align: center;
    text-decoration: none;
    transition: transform var(--transition-fast);
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  .button:disabled {
    opacity: 0.5;
  }

  .button:active {
    transform: scale(0.9);
  }

  .button--secondary {
    color: var(--color-secondary);
  }
</style>
