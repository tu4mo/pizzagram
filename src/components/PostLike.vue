<template>
  <Button
    :disabled="isLikeClicked"
    :secondary="!hasLiked"
    :aria-label="hasLiked ? 'Unlike' : 'Like'"
    @click="onLikeClick"
  >
    <Icon :fill="hasLiked" name="heart" />
  </Button>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  import Button from './Button.vue'
  import Icon from './Icon.vue'

  import { authStore } from '@/store/auth'
  import { postsStore, toggleLike } from '@/store/posts'

  type Props = {
    postId: string
  }

  const { postId } = defineProps<Props>()

  const isLikeClicked = ref(false)

  async function onLikeClick() {
    isLikeClicked.value = true
    await toggleLike(postId)
    isLikeClicked.value = false
  }

  const hasLiked = computed(
    () => !!postsStore.posts[postId]?.likes[authStore.userId],
  )
</script>
