<template>
  <router-link
    :exact="exact"
    :to="to"
    active-class="nav-item--active"
    class="nav-item"
  >
    <BaseIcon :name="icon" />
  </router-link>
</template>

<script>
import BaseIcon from "./BaseIcon";

export default {
  components: {
    BaseIcon
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
  color: var(--color-purple);

  &--active {
    color: var(--color-pink);
  }
}
</style>
