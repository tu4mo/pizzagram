<template>
  <component
    :is="component"
    :to="to"
    class="button"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    component: {
      default: "button",
      type: String
    },
    to: {
      default: null,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  background-color: transparent;
  border: 0;
  border-radius: 0.5rem;
  color: $color-pink;
  font-size: 1rem;
  font-weight: bold;
  display: block;
  line-height: 3rem;
  outline: none;
  text-align: center;
  text-decoration: none;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
}
</style>
