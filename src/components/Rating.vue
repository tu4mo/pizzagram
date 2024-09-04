<script setup lang="ts">
  import Button from './Button.vue'
  import Icon from './Icon.vue'

  const { modelValue = 0 } = defineProps<{ modelValue?: number }>()

  defineEmits<{ (event: 'update:modelValue', value: number): void }>()
</script>

<template>
  <div class="rating" role="radiogroup">
    <Button
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
      <Icon name="star" />
    </Button>
  </div>
</template>

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

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }

  .rating__button--active {
    color: var(--color-primary);
  }
</style>
