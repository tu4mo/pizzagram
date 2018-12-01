<template>
  <input
    :value="value"
    class="input"
    @input="$emit('input', $event.target.value)"
  />
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
  border: 1px solid var(--color-light);
  border-radius: 0.25rem;
  display: block;
  font-size: 1rem;
  line-height: 1;
  outline: none;
  padding: 1rem;
  width: 100%;
  -webkit-appearance: none;
}
</style>
