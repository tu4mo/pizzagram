<template>
  <DefaultLayout>
    <BaseSpinner v-if="isLoading" />
    <div
      v-else
      class="upload"
    >
      <PostImage
        :image-url="post.imageUrl"
      />
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseSpinner from "@/components/BaseSpinner";
import PostImage from "@/components/PostImage";

import { getPost } from "@/firebase";

export default {
  components: {
    BaseSpinner,
    DefaultLayout,
    PostImage
  },
  data() {
    return {
      isLoading: true,
      post: null
    };
  },
  created() {
    this.fetchPost(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchPost(to.params.id);
    next();
  },
  methods: {
    async fetchPost(id) {
      this.isLoading = true;
      this.post = await getPost(id);
      this.isLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.upload {
  padding: 2rem;
}
</style>
