<template>
  <DefaultLayout>
    <BaseSpinner v-if="isLoading" />
    <div
      v-else
      class="home"
    >
      <BasePost
        v-for="post in posts"
        :caption="post.caption"
        :created-at="post.createdAt"
        :image-url="post.imageUrl"
        :key="post.id"
        :username="post.user.username"
        :profile-url="post.user.imageUrl"
        class="home__base-post"
      />
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BasePost from "@/components/BasePost";
import BaseSpinner from "@/components/BaseSpinner";

import { getPosts } from "@/firebase";

export default {
  components: {
    BasePost,
    BaseSpinner,
    DefaultLayout
  },
  data() {
    return {
      isLoading: true,
      posts: []
    };
  },
  async created() {
    this.posts = await getPosts();
    this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin: 0 auto;
  max-width: 640px;
  padding: 2rem;
  position: relative;

  &__base-post:not(:last-child) {
    margin-bottom: 2rem;
  }
}
</style>
