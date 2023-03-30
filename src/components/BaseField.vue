<template>
  <p class="field">
    <component :is="as">
      <div class="field__label">{{ label }}</div>
      <slot />
    </component>
  </p>
</template>

<script setup lang="ts">
  type Props = {
    as: string
    label: string
  }

  withDefaults(defineProps<Props>(), {
    as: 'label',
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
