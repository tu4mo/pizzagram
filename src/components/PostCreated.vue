<script setup lang="ts">
  import { computed } from 'vue'

  const { createdAt } = defineProps<{
    createdAt: Date | undefined
  }>()

  const createdDate = computed(() => {
    if (!createdAt) return ''

    const now = new Date()
    const diffInDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

    if (diffInDays < 5) {
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
      const diffInDaysRounded = Math.floor(diffInDays)

      if (diffInDaysRounded === 0) {
        const diffInHours = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60),
        )
        if (diffInHours === 0) {
          const diffInMinutes = Math.floor(
            (now.getTime() - createdAt.getTime()) / (1000 * 60),
          )
          return rtf.format(-diffInMinutes, 'minute')
        }
        return rtf.format(-diffInHours, 'hour')
      }
      return rtf.format(-diffInDaysRounded, 'day')
    }

    return createdAt.toLocaleDateString()
  })
</script>

<template>
  <div class="post-created">{{ createdDate }}</div>
</template>

<style scoped>
  .post-created {
    color: var(--color-gray);
  }
</style>
