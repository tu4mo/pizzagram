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
  import type { Post } from '@/api/posts'
  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'
  import { computed, ref } from 'vue'
  import { toggleLike } from '@/store/posts'
  import { authStore } from '@/store/auth'

  type Props = {
    post: Post
  }

  const { post } = defineProps<Props>()

  const isLikeClicked = ref(false)

  const onLikeClick = async () => {
    isLikeClicked.value = true
    await toggleLike(post.id)
    isLikeClicked.value = false
  }

  const hasLiked = computed(() => post.likes?.includes(authStore.userId))
</script>
