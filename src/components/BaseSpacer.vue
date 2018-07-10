<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    mb1: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    classes() {
      return [
        "spacer",
        {
          "spacer--mb1": this.mb1
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.spacer {
  &--mb1 {
    margin-bottom: 1rem;
  }
}
</style>
