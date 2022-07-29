<template>
  <div :class="classes"><slot /></div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    mb1: {
      default: false,
      type: Boolean,
    },
    mb2: {
      default: false,
      type: Boolean,
    },
    mt1: {
      default: false,
      type: Boolean,
    },
    my1: {
      default: false,
      type: Boolean,
    },
  })

  const classes = computed(() => ({
    spacer: true,
    'spacer--mb1': props.mb1,
    'spacer--mb2': props.mb2,
    'spacer--mt1': props.mt1,
    'spacer--my1': props.my1,
  }))
</script>

<style scoped>
  .spacer--mb1 {
    margin-bottom: 1rem;
  }

  .spacer--mb2 {
    margin-bottom: 2rem;
  }

  .spacer--mt1 {
    margin-top: 1rem;
  }

  .spacer--my1 {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
</style>
