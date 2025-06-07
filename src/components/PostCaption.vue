<script setup lang="ts">
  const props = defineProps<{
    caption?: string
    isEditable?: boolean
  }>()

  const emit = defineEmits<(event: 'change', newCaption: string) => void>()

  function onCaptionChange() {
    const newCaption = prompt('Caption', props.caption)
    if (newCaption !== null && newCaption !== props.caption) {
      emit('change', newCaption)
    }
  }
</script>

<template>
  <button
    v-if="caption || isEditable"
    class="post__caption"
    :disabled="!isEditable"
    @click="onCaptionChange"
  >
    {{ caption || 'Add caption' }}
  </button>
</template>

<style scoped>
  .post__caption {
    backdrop-filter: var(--blur);
    background-color: rgba(var(--color-background-rgb) / 0.8);
    border: none;
    border-radius: var(--radius-sm);
    bottom: 0;
    color: var(--color-secondary);
    cursor: pointer;
    font-size: var(--font-size-sm);
    left: 0;
    margin: 1rem;
    max-width: calc(100% - 2rem);
    overflow: hidden;
    padding: 0.25rem 0.5rem;
    position: absolute;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post__caption:disabled {
    cursor: default;
  }

  .post__caption:not(:disabled):hover {
    background-color: var(--color-background);
  }
</style>
