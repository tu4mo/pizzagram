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
      <BaseButton
        v-else
        @click="fetchPosts"
      >
        Load More
      </BaseButton>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";
import BasePost from "@/components/BasePost";
import BaseSpinner from "@/components/BaseSpinner";

export default {
  components: {
    BaseButton,
    BasePost,
    BaseSpinner,
    DefaultLayout
  },
  created() {
    this.fetchPosts();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("getPostsForHome");
    });
  },
  methods: {
    fetchPosts() {
      this.$store.dispatch("getPostsForHome", true);
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 2rem;
  position: relative;

  &__base-post:not(:last-child) {
    margin-bottom: 2rem;
  }
}
</style>
