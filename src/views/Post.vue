<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import type { User } from '@/api/user'
  import { fetchUser } from '@/api/user'
  import Post from '@/components/Post.vue'
  import { getIsMe } from '@/store/auth'
  import { optimisticallyRemovePostFromFeed } from '@/store/feeds'
  import { postsStore, getPost, removePost } from '@/store/posts'

  const route = useRoute()
  const router = useRouter()
  const postId = computed(() =>
    typeof route.params.postId === 'string' ? route.params.postId : undefined,
  )
  const post = computed(() =>
    postId.value ? postsStore.posts[postId.value] : undefined,
  )
  const isMe = computed(() => getIsMe(post.value?.userId))
  const user = ref<User | undefined>()

  watch(
    () => route.params.postId,
    async (postId) => {
      if (typeof postId === 'string') {
        const post = await getPost(postId)

        if (post?.userId) {
          user.value = await fetchUser(post.userId)
        }
      }
    },
    { immediate: true },
  )

  async function onRemoveClick() {
    if (typeof postId.value === 'string') {
      await removePost(postId.value)
      optimisticallyRemovePostFromFeed(postId.value)
      router.go(-1)
    }
  }
</script>

<template>
  <Post :is-removable="isMe" :post="post" @remove-click="onRemoveClick" />
</template>
