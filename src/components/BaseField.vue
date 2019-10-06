<template>
  <div class="field">
    <label>
      <div class="field__label">{{ label }}</div>
      <slot />
    </label>
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
    color: var(--color-primary);
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
  }
}
</style>
