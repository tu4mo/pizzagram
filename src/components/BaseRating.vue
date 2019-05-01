<template>
  <div class="rating">
    <BaseButton
      v-for="rating in [1, 2, 3, 4, 5]"
      :class="['rating__button', { 'rating__button--active': rating <= value }]"
      :key="rating"
      @click="$emit('change', rating)"
    >
      <BaseIcon name="star" />
    </BaseButton>
  </div>
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
