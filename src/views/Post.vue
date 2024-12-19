<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import type { User } from '@/api/user'
  import { fetchUser } from '@/api/user'
  import Dialog from '@/components/Dialog.vue'
  import Post from '@/components/Post.vue'
  import Spinner from '@/components/Spinner.vue'
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

  async function onClose() {
    await router.replace({
      name: 'profile',
      params: { username: user.value?.username },
    })
  }
</script>

<template>
  <Dialog :is-open="!!post" @close="onClose">
    <Spinner v-if="!post" inline />
    <Post
      v-else
      :is-removable="isMe"
      :post="post"
      @remove-click="onRemoveClick"
    />
  </Dialog>
</template>
