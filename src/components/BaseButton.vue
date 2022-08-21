<template>
  <component
    :is="component"
    v-bind="$attrs"
    :class="[
      'button',
      { [`button--secondary`]: secondary, [`button--${variant}`]: variant },
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  defineProps({
    secondary: {
      default: false,
      type: Boolean,
    },
    component: {
      default: 'button',
      type: String,
    },
    variant: {
      default: null,
      type: String,
    },
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
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  .button:disabled {
    opacity: 0.5;
  }

  .button--inline {
    display: inline;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  .button--secondary {
    color: var(--color-secondary);
  }
</style>
