<script setup lang="ts">
  const { borderless = false, modelValue } = defineProps<{
    borderless?: boolean
    modelValue: string
  }>()

  defineEmits<{ (event: 'update:modelValue', value: string): void }>()

  defineOptions({ inheritAttrs: false })
</script>

<template>
  <input
    v-bind="$attrs"
    :class="['input', { 'input--borderless': borderless }]"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<style scoped>
  .input {
    appearance: none;
    background-color: var(--color-background);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-light);
    display: block;
    font-size: var(--font-size-md);
    line-height: 1;
    outline-color: var(--color-secondary);
    padding: 1rem;
    transition: border-color 0.1s ease-in-out;
    width: 100%;
  }

  .input--borderless {
    border: 0;
    padding: 0;
  }

  .input:hover {
    border-color: var(--color-gray);
  }

  .input:disabled {
    background-color: var(--color-light);
  }
</style>
