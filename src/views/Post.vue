<template>
  <BaseSpinner v-if="!singlePost" />
  <DefaultLayout v-else>
    <div class="post-view">
      <BasePost
        :is-removable="isMe"
        :post="singlePost"
        @remove-click="onRemoveClick"
      />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import DefaultLayout from '@/layouts/Default.vue'

  import BasePost from '@/components/BasePost.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  import { getIsMe } from '@/store/auth'
  import { computed, ref, watch } from 'vue'
  import type { Post } from '@/api/posts'
  import { getPost, removePost } from '@/store/posts'
  import { useRoute, useRouter } from 'vue-router'
  import { setTitle } from '@/title'

  const route = useRoute()
  const router = useRouter()
  const postId = route.params.postId
  const singlePost = ref<Post | undefined>(undefined)
  const isMe = computed(() => getIsMe(singlePost.value?.userId))

  watch(
    () => route.params.postId,
    async (postId) => {
      if (postId && typeof postId === 'string') {
        singlePost.value = undefined
        singlePost.value = await getPost(postId)

        setTitle(singlePost.value?.caption, true)
      }
    },
    { immediate: true }
  )

  const onRemoveClick = () => {
    if (postId && typeof postId === 'string') {
      removePost(postId)
      router.go(-1)
    }
  }
</script>

<style scoped>
  .post-view {
    margin: 0 auto;
    max-width: var(--content-width);
    padding: 1rem 0;
  }

  @media (min-width: 640px) {
    .post-view {
      padding: 2rem;
    }
  }
</style>
