<template>
  <BaseLink
    :exact="exact"
    :to="to"
    active-class="nav-item--active"
    class="nav-item"
  >
    <BaseIcon :name="icon" />
    <div v-if="badge" class="nav-item__badge">{{ badge }}</div>
  </BaseLink>
</template>

<script>
import BaseIcon from "./BaseIcon";
import BaseLink from "./BaseLink";

export default {
  components: {
    BaseIcon,
    BaseLink
  },
  props: {
    badge: {
      default: null,
      type: [Number, String]
    },
    exact: {
      default: false,
      type: Boolean
    },
    icon: {
      required: true,
      type: String
    },
    to: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-item {
  color: var(--color-secondary);
  position: relative;

  &--active {
    color: var(--color-primary);
  }

  &__badge {
    background-color: var(--color-primary);
    border-radius: 0.75rem;
    color: #fff;
    line-height: 1;
    padding: 0.1rem 0.25rem;
    position: absolute;
    top: -0.3125rem;
    right: -0.3125rem;
  }
}
</style>
