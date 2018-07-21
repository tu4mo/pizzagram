<template>
  <router-link
    :to="to"
    class="link"
  >
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
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
