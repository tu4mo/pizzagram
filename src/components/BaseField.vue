<template>
  <div class="field">
    <component :is="as">
      <div class="field__label">{{ label }}</div>
      <slot />
    </component>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  export default defineComponent({
    props: {
      as: {
        default: 'label',
        type: String,
      },
      label: {
        required: true,
        type: String,
      },
    },
  })
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
