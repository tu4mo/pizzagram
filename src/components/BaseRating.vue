<template>
  <div class="rating" role="radiogroup">
    <BaseButton
      v-for="rating in [1, 2, 3, 4, 5]"
      :key="rating"
      :aria-label="`Rating: ${rating}`"
      :aria-checked="rating === value"
      :class="['rating__button', { 'rating__button--active': rating <= value }]"
      role="radio"
      @click.prevent="$emit('input', rating === value ? 0 : rating)"
    >
      <BaseIcon name="star" />
    </BaseButton>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'

  export default defineComponent({
    components: {
      BaseButton,
      BaseIcon,
    },
    props: {
      value: {
        required: true,
        type: Number,
      },
    },
  })
</script>

<style lang="scss" scoped>
  .rating {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0.5rem 0;

    &__button {
      color: var(--color-gray);
      width: auto;

      &:not(:last-child) {
        margin-right: 1rem;
      }

      &--active {
        color: var(--color-primary);
      }
    }
  }
</style>
