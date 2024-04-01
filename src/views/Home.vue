<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'

  import Post from '@/components/Post.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { fetchPostsForHome, getPosts, postsStore } from '@/store/posts'
  import { setTitle } from '@/title'

  setTitle()

  async function handleScroll() {
    if (
      window.innerHeight + Math.round(window.scrollY) >=
        document.body.offsetHeight &&
      !postsStore.isLoading
    ) {
      await fetchPostsForHome()
    }
  }

  onMounted(async () => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const posts = computed(() => getPosts())
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
