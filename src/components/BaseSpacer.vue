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
    },
    my1: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    classes() {
      return {
        spacer: true,
        "spacer--mb1": this.mb1,
        "spacer--my1": this.my1
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.spacer {
  &--mb1 {
    margin-bottom: 1rem;
  }

  &--my1 {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
}
</style>
