<template>
  <div class="like">
    <Button
      :disabled="isLikeClicked"
      :secondary="!hasLiked"
      :aria-label="hasLiked ? 'Unlike' : 'Like'"
      @click="onLikeClick"
    >
      <Icon :fill="hasLiked" name="heart" />
    </Button>
    <div v-if="likes > 0">{{ likes }} like{{ likes !== 1 ? 's' : '' }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  import Button from './Button.vue'
  import Icon from './Icon.vue'

  import type { Post } from '@/api/posts'
  import { authStore } from '@/store/auth'
  import { toggleLike } from '@/store/posts'

  type Props = {
    post: Post
  }

  const props = defineProps<Props>()

  const isLikeClicked = ref(false)

  async function onLikeClick() {
    isLikeClicked.value = true
    await toggleLike(props.post.id)
    isLikeClicked.value = false
  }

  const hasLiked = computed(() => !!props.post.likes[authStore.userId])

  const likes = computed(() =>
    props.post.likes ? Object.keys(props.post.likes).length : 0,
  )
</script>

<style scoped>
  .like {
    display: flex;
    gap: 0.5rem;
    white-space: nowrap;
  }
</style>
