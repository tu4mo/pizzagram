<template>
  <ul class="rating">
    <li v-for="rating in [1, 2, 3, 4, 5]" :key="rating" class="rating__item">
      <BaseButton
        :aria-label="`Rating: ${rating}`"
        :class="[
          'rating__button',
          { 'rating__button--active': rating <= value }
        ]"
        @click.prevent="$emit('input', rating)"
      >
        <BaseIcon name="star" />
      </BaseButton>
    </li>
  </ul>
</template>

<script>
  import BaseButton from "./BaseButton";
  import BaseIcon from "./BaseIcon";

  export default {
    components: {
      BaseButton,
      BaseIcon
    },
    props: {
      value: {
        required: true,
        type: Number
      }
    }
  };
</script>

<style lang="scss" scoped>
  .rating {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0.5rem 0;

    &__item {
      &:not(:last-child) {
        margin-right: 1rem;
      }
    }

    &__button {
      color: var(--color-gray);
      width: auto;

      &--active {
        color: var(--color-primary);
      }
    }
  }
</style>
