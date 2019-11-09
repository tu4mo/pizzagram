<template>
  <input
    v-bind="$attrs"
    :class="['input', { 'input--borderless': borderless }]"
    :value="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      borderless: {
        default: false,
        type: Boolean
      },
      value: {
        required: true,
        type: String
      }
    }
  };
</script>

<style lang="scss" scoped>
  .input {
    background-color: var(--color-background);
    border: 1px solid var(--color-light);
    border-radius: 0.25rem;
    display: block;
    font-size: 1rem;
    line-height: 1;
    outline: none;
    padding: 1rem;
    width: 100%;
    -webkit-appearance: none;

    &--borderless {
      border: 0;
      padding: 0;
    }
  }
</style>
