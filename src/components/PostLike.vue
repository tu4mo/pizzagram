<script setup lang="ts">
  import { computed, ref } from 'vue'

  import Button from './Button.vue'
  import Icon from './Icon.vue'

  import type { Post } from '@/api/posts'
  import { authStore } from '@/store/auth'
  import { toggleLike } from '@/store/posts'

  const { post } = defineProps<{ post: Post | undefined }>()

  const isLikeClicked = ref(false)

  async function onLikeClick() {
    if (!post) {
      return
    }

    isLikeClicked.value = true
    await toggleLike(post.id)
    isLikeClicked.value = false
  }

  const hasLiked = computed(() => !!post?.likes[authStore.userId])

  const likes = computed(() =>
    post?.likes ? Object.keys(post.likes).length : 0,
  )
</script>

<template>
  <div class="like">
    <Button
      :disabled="!post || isLikeClicked"
      :secondary="!hasLiked"
      :aria-label="hasLiked ? 'Unlike' : 'Like'"
      @click="onLikeClick"
    >
      <Icon :fill="hasLiked" name="heart" />
    </Button>
    <div v-if="likes > 0">{{ likes }} like{{ likes !== 1 ? 's' : '' }}</div>
  </div>
</template>

<style scoped>
  .like {
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
  }
</style>
