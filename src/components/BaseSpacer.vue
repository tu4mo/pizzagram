<template>
  <div :class="classes"><slot /></div>
</template>

<script lang="ts">
  import { computed, defineComponent } from '@vue/composition-api'

  export default defineComponent({
    props: {
      mb1: {
        default: false,
        type: Boolean
      },
      mb2: {
        default: false,
        type: Boolean
      },
      mt1: {
        default: false,
        type: Boolean
      },
      my1: {
        default: false,
        type: Boolean
      }
    },
    setup(props) {
      const classes = computed(() => ({
        spacer: true,
        'spacer--mb1': props.mb1,
        'spacer--mb2': props.mb2,
        'spacer--mt1': props.mt1,
        'spacer--my1': props.my1
      }))

      return { classes }
    }
  })
</script>

<style lang="scss" scoped>
  .spacer {
    &--mb1 {
      margin-bottom: 1rem;
    }

    &--mb2 {
      margin-bottom: 2rem;
    }

    &--mt1 {
      margin-top: 1rem;
    }

    &--my1 {
      margin-bottom: 1rem;
      margin-top: 1rem;
    }
  }
</style>
