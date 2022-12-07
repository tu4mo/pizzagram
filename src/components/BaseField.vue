<template>
  <p class="field">
    <component :is="as">
      <div class="field__label">{{ label }}</div>
      <slot />
    </component>
  </p>
</template>

<script setup lang="ts">
  defineProps({
    as: {
      default: 'label',
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
  })
</script>

<style scoped>
  .field__label {
    color: var(--color-primary);
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
  }
</style>
