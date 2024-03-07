<template>
  <div class="spacer" :style="{ gap: `${gap}rem` }"><slot /></div>
</template>

<script setup lang="ts">
  type Props = {
    gap: '1' | '2'
  }

  defineProps<Props>()
</script>

<style scoped>
  .spacer {
    display: flex;
    flex-direction: column;
  }
</style>
