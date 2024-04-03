<script setup lang="ts">
  import Button from './Button.vue'
  import Icon from './Icon.vue'

  import type { Post } from '@/api/posts'

  type Props = {
    post: Post
  }

  const props = defineProps<Props>()
</script>

<template v-if="isDevelopment">
  <div class="comment">
    <Button aria-label="Comment" secondary>
      <Icon name="messageCircle" />
    </Button>
    <div v-if="props.post.commentsCount > 0">
      {{ props.post.commentsCount }} comment{{
        props.post.commentsCount !== 1 ? 's' : ''
      }}
    </div>
  </div>
</template>

<style scoped>
  .comment {
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
  }
</style>
