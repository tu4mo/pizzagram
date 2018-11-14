<template>
  <component :is="component" v-bind="$attrs" class="button" v-on="$listeners">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    component: {
      default: "button",
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  background-color: transparent;
  border: 0;
  border-radius: 0.5rem;
  color: var(--color-pink);
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  display: block;
  line-height: 3rem;
  outline: none;
  text-align: center;
  text-decoration: none;
  width: 100%;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    opacity: 0.5;
  }
}
</style>
