<script setup lang="ts">
  import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

  const { enabled } = defineProps<{ enabled: boolean }>()
  const emit = defineEmits<(event: 'is-intersecting') => void>()

  const div = useTemplateRef('div')
  const observer = ref<IntersectionObserver>()

  onMounted(() => {
    if (!div.value) return

    observer.value = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && enabled) {
          emit('is-intersecting')
          break
        }
      }
    })

    observer.value.observe(div.value)
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })
</script>

<template>
  <div ref="div" />
</template>
