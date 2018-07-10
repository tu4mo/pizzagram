<template>
  <DefaultLayout>
    <BaseSpinner v-if="isLoading" />
    <div
      v-else
      class="upload"
    >
      <BaseSpacer mb1>
        <PostImage
          :image-url="post.imageUrl"
        />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput
          v-model="caption"
          placeholder="Caption"
        />
      </BaseSpacer>
      <BaseButton @click="onShareClick">Share</BaseButton>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";
import BaseSpacer from "@/components/BaseSpacer";
import BaseSpinner from "@/components/BaseSpinner";
import BaseInput from "@/components/BaseInput";
import PostImage from "@/components/PostImage";

import { getPost, sharePost } from "@/firebase";

export default {
  components: {
    BaseButton,
    BaseSpacer,
    BaseSpinner,
    BaseInput,
    DefaultLayout,
    PostImage
  },
  data() {
    return {
      caption: "",
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
    },
    async onShareClick() {
      this.isLoading = true;
      await sharePost(this.$route.params.id, this.caption);
      this.isLoading = false;
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload {
  padding: 2rem;
}
</style>
