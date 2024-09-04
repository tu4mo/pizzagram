<script setup lang="ts">
  import Button from './Button.vue'
  import Icon from './Icon.vue'

  import type { Post } from '@/api/posts'

  defineProps<{ post: Post }>()

  const emit = defineEmits<{ (event: 'click'): void }>()
</script>

<template>
  <Button aria-label="Comment" secondary @click="emit('click')">
    <div class="comment">
      <Icon name="messageCircle" />
      <div class="comment__label">
        {{
          post.commentsCount > 0
            ? `${post.commentsCount} comment${
                post.commentsCount !== 1 ? 's' : ''
              }`
            : 'Add a comment'
        }}
      </div>
    </div>
  </Button>
</template>

<style scoped>
  .comment {
    align-items: center;
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
  }

  .comment__label {
    line-height: 1;
  }
</style>
