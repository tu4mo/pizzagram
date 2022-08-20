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
        <BaseInput
          v-model="customItem"
          borderless
          placeholder="Add new location"
        />
      </label>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import BaseInput from './BaseInput.vue'

  defineProps({
    name: {
      required: true,
      type: String,
    },
    options: {
      type: Array as () => { label?: string; value?: string }[],
      default: () => [],
    },
    value: {
      required: true,
      type: String,
    },
  })

  const customItem = ref('')

  const emit = defineEmits(['change'])

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
    font-size: 1rem;
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
