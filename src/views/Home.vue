<template>
  <DefaultLayout max-width>
    <div class="home">
      <BasePost
        v-for="post in posts"
        :key="post.id"
        :image-to="{ name: 'post', params: { postId: post.id } }"
        :post="post"
      />
      <BaseSpinner v-if="isLoading" :inline="posts.length > 0" />
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, onUnmounted } from 'vue'

  import DefaultLayout from '@/layouts/Default.vue'

  import BasePost from '@/components/BasePost.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  import store from '@/store'

  export default defineComponent({
    components: {
      BasePost,
      BaseSpinner,
      DefaultLayout,
    },
    setup() {
      const isAuthenticated = computed(() => store.state.auth.isAuthenticated)

      const fetchPosts = () => {
        store.dispatch('getPostsForHome')
      }

      const handleScroll = () => {
        if (
          window.innerHeight + window.pageYOffset >=
            document.body.offsetHeight &&
          !store.state.isLastPostReached &&
          !store.state.isLoading
        ) {
          fetchPosts()
        }
      }

      onMounted(() => {
        fetchPosts()

        if (isAuthenticated.value) {
          window.addEventListener('scroll', handleScroll)
        }
      })

      onUnmounted(() => {
        if (isAuthenticated.value) {
          window.removeEventListener('scroll', handleScroll)
        }
      })

      return {
        isLoading: computed(() => store.state.isLoading),
        posts: computed(() => store.getters.getPostsByFeed('home')),
      }
    },
  })
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
