<template>
  <DefaultLayout>
    <div class="post-view">
      <BasePost
        v-if="Object.keys(singlePost).length"
        :key="singlePost.id"
        :post="singlePost"
      />
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BasePost from "@/components/BasePost";

export default {
  components: {
    BasePost,
    DefaultLayout
  },
  computed: {
    postId() {
      return this.$route.params.postId;
    },
    singlePost() {
      return this.$store.getters.getPostById(this.postId);
    }
  },
  created() {
    const { postId } = this.$route.params;
    this.fetchPost(postId);
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.postId !== from.params.postId) {
      this.fetchPost(to.params.postId);
    }
    next();
  },
  methods: {
    fetchPost(postId) {
      this.$store.dispatch("getPostById", postId);
    }
  }
};
</script>

<style lang="scss" scoped>
.post-view {
  padding: 2rem;
}
</style>
