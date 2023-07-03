<template>
  <div class="rating" role="radiogroup">
    <BaseButton
      v-for="rating in [1, 2, 3, 4, 5]"
      :key="rating"
      :aria-label="`Rating: ${rating}`"
      :aria-checked="rating === modelValue"
      :class="[
        'rating__button',
        { 'rating__button--active': rating <= modelValue },
      ]"
      role="radio"
      @click.prevent="
        $emit('update:modelValue', rating === modelValue ? 0 : rating)
      "
    >
      <BaseIcon name="star" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'

  type Props = {
    modelValue: number
  }

  withDefaults(defineProps<Props>(), {
    modelValue: 0,
  })

  defineEmits<{ (event: 'update:modelValue', value: number): void }>()
</script>

<style scoped>
  .rating {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0.5rem 0;
  }

  .rating__button {
    color: var(--color-gray);
    width: auto;
  }

  .rating__button:not(:last-child) {
    margin-right: 1rem;
  }

  .rating__button--active {
    color: var(--color-primary);
  }
</style>
