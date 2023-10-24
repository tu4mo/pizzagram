<template>
  <BaseSpinner v-if="!post" />
  <DefaultLayout v-else>
    <div class="post-view">
      <BasePost
        :is-removable="isMe"
        :post="post"
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
  import { postsStore } from '@/store/posts'
  import { computed, watch } from 'vue'
  import { getPost, removePost } from '@/store/posts'
  import { useRoute, useRouter } from 'vue-router'
  import { setTitle } from '@/title'

  const route = useRoute()
  const router = useRouter()
  const postId = computed(() =>
    typeof route.params.postId === 'string' ? route.params.postId : undefined,
  )
  const post = computed(() =>
    postId.value ? postsStore.posts[postId.value] : undefined,
  )
  const isMe = computed(() => getIsMe(post.value?.userId))

  watch(
    () => route.params.postId,
    async (postId) => {
      if (typeof postId === 'string') {
        const post = await getPost(postId)
        setTitle(post?.caption, true)
      }
    },
    { immediate: true },
  )

  function onRemoveClick() {
    if (postId.value && typeof postId.value === 'string') {
      removePost(postId.value)
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
