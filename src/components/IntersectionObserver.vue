<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps<{
    enabled: boolean
  }>()

  const emit = defineEmits<{ (event: 'is-intersecting'): void }>()

  const div = ref<HTMLDivElement | null>(null)
  const observer = ref<IntersectionObserver>()

  onMounted(() => {
    if (!div.value) return

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && props.enabled) {
          emit('is-intersecting')
        }
      })
    })

    observer.value.observe(div.value)
  })

  onUnmounted(() => {
    if (observer.value) observer.value.disconnect()
  })
</script>

<template>
  <div ref="div" />
</template>
