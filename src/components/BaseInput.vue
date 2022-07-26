<template>
  <input
    v-bind="$attrs"
    :class="['input', { 'input--borderless': borderless }]"
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    inheritAttrs: false,
  })
</script>

<script setup lang="ts">
  defineProps({
    borderless: {
      default: false,
      type: Boolean,
    },
    value: {
      required: true,
      type: String,
    },
  })
</script>

<style scoped>
  .input {
    background-color: var(--color-background);
    border: 1px solid var(--color-light);
    border-radius: 0.25rem;
    display: block;
    font-size: 1rem;
    line-height: 1;
    padding: 1rem;
    width: 100%;
    -webkit-appearance: none;
  }

  .input--borderless {
    border: 0;
    padding: 0;
  }
</style>
