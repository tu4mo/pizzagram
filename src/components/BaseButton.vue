<template>
  <component
    :is="component"
    v-bind="$attrs"
    :class="['button', { [`button--${variant}`]: variant }]"
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
      variant: {
        default: null,
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
    color: var(--color-primary);
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

    &--inline {
      display: inline;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
  }
</style>
