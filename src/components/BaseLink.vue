<template>
  <router-link :active-class="activeClass" :exact="exact" :to="to" class="link">
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
    activeClass: {
      default: null,
      type: String
    },
    exact: {
      default: false,
      type: Boolean
    },
    to: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  color: var(--color-pink);
  text-decoration: none;
}
</style>
