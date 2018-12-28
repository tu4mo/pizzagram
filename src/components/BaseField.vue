<template>
  <div class="field">
    <label class="field__label">{{ label }}</label> <slot />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.field {
  &__label {
    display: block;
    margin-bottom: 0.25rem;
  }
}
</style>
