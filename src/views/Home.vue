<template>
  <DefaultLayout>
    <div class="home">
      <BasePost
        v-for="post in $store.getters.getPostsByFeed('home')"
        :key="post.id"
        :image-to="{ name: 'post', params: { postId: post.id } }"
        :post="post"
        class="home__base-post"
      />
      <BaseSpinner
        v-if="$store.state.isLoading"
        :inline="$store.getters.getPostsByFeed('home').length > 0"
      />
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BasePost from "@/components/BasePost";
import BaseSpinner from "@/components/BaseSpinner";

export default {
  components: {
    BasePost,
    BaseSpinner,
    DefaultLayout
  },
  created() {
    this.fetchPosts();
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    fetchPosts() {
      this.$store.dispatch("getPostsForHome");
    },
    handleScroll() {
      if (
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
        !this.$store.state.isLastPostReached &&
        !this.$store.state.isLoading
      ) {
        this.fetchPosts();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin: 0 auto;
  max-width: var(--content-width);
  padding: 1rem 0;
  position: relative;

  @media (min-width: 640px) {
    padding: 2rem;
  }

  &__base-post:not(:last-child) {
    margin-bottom: 2rem;

    @media (min-width: 640px) {
      margin-bottom: 4rem;
    }
  }
}
</style>
