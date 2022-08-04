<template>
  <DefaultLayout max-width>
    <div class="home">
      <BasePost
        v-for="post in posts"
        :key="post.id"
        :image-to="{ name: 'post', params: { postId: post.id } }"
        :post="post"
      />
      <BaseSpinner v-if="postsStore.isLoading" :inline="posts.length > 0" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'

  import DefaultLayout from '@/layouts/Default.vue'

  import BasePost from '@/components/BasePost.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  import store from '@/store'
  import { postsStore } from '@/store/posts'

  const fetchPosts = () => {
    store.dispatch('getPostsForHome')
  }

  const handleScroll = () => {
    if (
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
      !postsStore.isLastPostReached &&
      !postsStore.isLoading
    ) {
      fetchPosts()
    }
  }

  onMounted(() => {
    fetchPosts()

    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const posts = computed(() => store.getters.getPostsByFeed('home'))
</script>

<style lang="scss" scoped>
  .home {
    display: grid;
    gap: 2rem;
    margin: 0 auto;
    padding: 1rem 0;
    position: relative;

    @media (min-width: 640px) {
      gap: 4rem;
      padding: 2rem;
    }
  }
</style>
