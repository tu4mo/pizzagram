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
  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'
  import { computed, ref } from 'vue'
  import { postsStore, toggleLike } from '@/store/posts'
  import { authStore } from '@/store/auth'

  type Props = {
    postId: string
  }

  const { postId } = defineProps<Props>()

  const isLikeClicked = ref(false)

  const onLikeClick = async () => {
    isLikeClicked.value = true
    await toggleLike(postId)
    isLikeClicked.value = false
  }

  const hasLiked = computed(
    () => authStore.userId in postsStore.posts[postId].likes,
  )
</script>
