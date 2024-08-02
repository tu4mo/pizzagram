<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import type { User } from '@/api/user'
  import { fetchUser } from '@/api/user'
  import Post from '@/components/Post.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { getIsMe } from '@/store/auth'
  import { optimisticallyRemovePostFromFeed } from '@/store/feeds'
  import { postsStore, getPost, removePost } from '@/store/posts'
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
  const user = ref<User | undefined>()

  watch(
    () => route.params.postId,
    async (postId) => {
      if (typeof postId === 'string') {
        const post = await getPost(postId)
        setTitle(post?.caption, true)

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
  <Spinner v-if="!post" />
  <DefaultLayout v-else :title="user?.username">
    <div class="post-view">
      <Post :is-removable="isMe" :post="post" @remove-click="onRemoveClick" />
    </div>
  </DefaultLayout>
</template>

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
