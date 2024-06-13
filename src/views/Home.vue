<script setup lang="ts">
  import { computed, onMounted } from 'vue'

  import IntersectionObserver from '@/components/IntersectionObserver.vue'
  import Post from '@/components/Post.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { fetchPostsForHome, getPostsForHome, postsStore } from '@/store/posts'
  import { setTitle } from '@/title'

  setTitle()

  onMounted(() => {
    if (!postsStore.isLoading) fetchPostsForHome()
  })

  const posts = computed(() => getPostsForHome())
</script>

<template>
  <DefaultLayout max-width>
    <div class="home">
      <Post
        v-for="post in posts"
        :key="post.id"
        :image-to="{ name: 'post', params: { postId: post.id } }"
        :post="post"
      />
      <Spinner v-if="postsStore.isLoading" :inline="posts.length > 0" />
      <IntersectionObserver
        :enabled="!postsStore.isLoading"
        @is-intersecting="fetchPostsForHome()"
      />
    </div>
  </DefaultLayout>
</template>

<style scoped>
  .home {
    display: grid;
    gap: 2rem;
    margin: 0 auto;
    padding: 1rem 0;
    position: relative;
  }

  @media (min-width: 640px) {
    .home {
      gap: 4rem;
      padding: 2rem;
    }
  }
</style>
, onMountedgetPostsForHome,
