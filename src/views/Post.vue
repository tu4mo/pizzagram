<template>
  <DefaultLayout>
    <div class="post-view">
      <template v-if="Object.keys(singlePost).length">
        <BasePost :post="singlePost" />
        <div
          v-if="$store.getters.getIsMe(singlePost.userId)"
          class="post-view__footer"
        >
          <BaseButton @click="onRemoveClick">Remove</BaseButton>
        </div>
      </template>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";
import BasePost from "@/components/BasePost";

export default {
  components: {
    BaseButton,
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
      this.$store.dispatch("getPostById", { postId });
    },
    onRemoveClick() {
      if (confirm("Are you sure you want to remove this photo?")) {
        this.$store.dispatch("removePost", this.postId);
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.post-view {
  padding: 2rem;
}
</style>
