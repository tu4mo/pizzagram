<template>
  <input
    :value="value"
    class="input"
    @input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  background-color: #fff;
  border: 1px solid $color-light;
  border-radius: 0.25rem;
  display: block;
  font-size: 1rem;
  outline: none;
  padding: 0.5rem;
  width: 100%;
  -webkit-appearance: none;
}
</style>
