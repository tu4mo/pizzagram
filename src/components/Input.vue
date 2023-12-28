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

<script setup lang="ts">
  type Props = {
    borderless?: boolean
    modelValue: string
  }

  withDefaults(defineProps<Props>(), {
    borderless: false,
  })

  defineEmits<{ (event: 'update:modelValue', value: string): void }>()

  defineOptions({ inheritAttrs: false })
</script>

<style scoped>
  .input {
    appearance: none;
    background-color: var(--color-background);
    border-radius: 0.5rem;
    border: 1px solid var(--color-light);
    display: block;
    font-size: var(--font-size-md);
    line-height: 1;
    outline-color: var(--color-secondary);
    padding: 1rem;
    width: 100%;
  }

  .input--borderless {
    border: 0;
    padding: 0;
  }

  .input:disabled {
    background-color: var(--color-light);
  }
</style>
