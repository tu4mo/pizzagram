<template>
  <BaseButton
    :disabled="isLikeClicked"
    :secondary="!hasLiked"
    @click="onLikeClick"
  >
    <BaseIcon :fill="hasLiked" name="heart" />
  </BaseButton>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'

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

  const hasLiked = computed(() =>
    postsStore.posts[postId]?.likes
      ? authStore.userId in postsStore.posts[postId].likes
      : false,
  )
</script>
