<template>
  <BaseLink
    :exact="exact"
    :to="to"
    active-class="nav-item--active"
    class="nav-item"
  >
    <BaseIcon :name="icon" />
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

  &--active {
    color: var(--color-primary);
  }
}
</style>
