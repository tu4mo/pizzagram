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
        :profile-url="profileUrl(post.user.email)"
        class="home__base-post"
      />
    </div>
  </DefaultLayout>
</template>

<script>
import md5 from "md5";

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
  },
  methods: {
    profileUrl(email) {
      return `https://www.gravatar.com/avatar/${md5(
        email.toLowerCase()
      )}?d=identicon`;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin: 0 auto;
  padding: 2rem;
  position: relative;

  &__base-post:not(:last-child) {
    margin-bottom: 2rem;
  }
}
</style>
