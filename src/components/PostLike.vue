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
</script>
