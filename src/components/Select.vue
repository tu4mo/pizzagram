<template>
  <ul class="select">
    <li v-for="option in options" :key="option.value" class="select__item">
      <label class="select__label">
        <input
          :checked="option.value === value"
          :name="name"
          :value="option.value"
          class="select__input"
          type="radio"
          @change="$emit('change', option.value)"
        />
        {{ option.label }}
      </label>
    </li>
    <li class="select__item">
      <label class="select__label">
        <input
          :checked="customItem === value"
          :name="name"
          :value="customItem"
          class="select__input"
          type="radio"
          @change="$emit('change', customItem)"
        />
        <Input v-model="customItem" borderless placeholder="Add new location" />
      </label>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import Input from './Input.vue'

  type Props = {
    name: string
    options: { label?: string; value: string }[]
    value: string
  }

  defineProps<Props>()

  const emit = defineEmits<{ (event: 'change', value: string): void }>()

  const customItem = ref('')

  watch(customItem, (value) => {
    emit('change', value)
  })
</script>

<style scoped>
  .select {
    background-color: var(--color-background);
    border: 1px solid var(--color-light);
    border-radius: 0.25rem;
    display: block;
    font-size: var(--font-size-md);
    list-style-type: none;
  }

  .select__item {
    padding: 1rem;
  }

  .select__item:not(:last-child) {
    border-bottom: 1px solid var(--color-light);
  }

  .select__label {
    align-items: center;
    display: flex;
  }

  .select__input {
    margin-right: 0.5rem;
  }
</style>
