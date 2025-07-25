<script setup lang="ts">
  const { as = 'label', label } = defineProps<{
    as?: string
    label: string
  }>()
</script>

<template>
  <p class="field">
    <component :is="as">
      <span class="field__label">{{ label }}</span>
      <slot />
    </component>
  </p>
</template>

<style scoped>
  .field__label {
    color: var(--color-primary);
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
  }
</style>
