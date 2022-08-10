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
  import { computed, getCurrentInstance, ref, watch } from 'vue'
  import { Post } from '@/api/posts'
  import { getPost, removePost } from '@/store/posts'

  const instance = getCurrentInstance()
  const postId = computed(() => instance?.proxy.$route.params.postId)
  const singlePost = ref<Post | undefined>(undefined)
  const isMe = computed(() => getIsMe(singlePost.value?.userId))

  watch(
    () => instance?.proxy.$route.params.postId,
    async (postId) => {
      if (postId) {
        singlePost.value = undefined
        singlePost.value = await getPost(postId)
      }
    },
    { immediate: true }
  )

  const onRemoveClick = () => {
    if (postId.value) {
      removePost(postId.value)
      instance?.proxy.$router.go(-1)
    }
  }
</script>

<style lang="scss" scoped>
  .post-view {
    margin: 0 auto;
    max-width: var(--content-width);
    padding: 1rem 0;

    @media (min-width: 640px) {
      padding: 2rem;
    }
  }
</style>
