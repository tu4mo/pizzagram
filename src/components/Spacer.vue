<script setup lang="ts">
  defineProps<{ gap: '1' | '2' }>()
</script>

<template>
  <div class="spacer" :style="{ gap: `${gap}rem` }"><slot /></div>
</template>

<style scoped>
  .spacer {
    display: flex;
    flex-direction: column;
  }
</style>
