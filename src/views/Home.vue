<template>
  <DefaultLayout max-width>
    <div class="home">
      <BasePost
        v-for="post in $store.getters.getPostsByFeed('home')"
        :key="post.id"
        :image-to="{ name: 'post', params: { postId: post.id } }"
        :post="post"
      />
      <BaseSpinner
        v-if="$store.state.isLoading"
        :inline="$store.getters.getPostsByFeed('home').length > 0"
      />
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUnmounted } from '@vue/composition-api'

  import DefaultLayout from '@/layouts/Default.vue'

  import BasePost from '@/components/BasePost.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  export default defineComponent({
    components: {
      BasePost,
      BaseSpinner,
      DefaultLayout,
    },
    setup(props, context) {
      const fetchPosts = () => {
        context.root.$store.dispatch('getPostsForHome')
      }

      const handleScroll = () => {
        if (
          window.innerHeight + window.pageYOffset >=
            document.body.offsetHeight &&
          !context.root.$store.state.isLastPostReached &&
          !context.root.$store.state.isLoading
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
