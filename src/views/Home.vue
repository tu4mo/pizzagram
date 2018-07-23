<template>
  <DefaultLayout>
    <BaseSpinner v-if="$store.state.isLoading" />
    <div
      v-else
      class="home"
    >
      <BasePost
        v-for="post in $store.getters.getPostsByFeed('home')"
        :caption="post.caption"
        :created-at="post.createdAt"
        :gravatar="post.user.gravatar"
        :image-url="post.imageUrl"
        :key="post.id"
        :username="post.user.username"
        class="home__base-post"
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
    this.$store.dispatch("getPostsForHome", true);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.dispatch("getPostsForHome");
    });
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
