<template>
  <DefaultLayout>
    <div class="upload">
      <BaseSpinner v-if="isLoading || 'uploading' in $route.query" />
      <div
        v-else-if="!$route.params.id"
        class="upload__info"
      >
        Use the Camera icon to upload a photo
      </div>
      <div
        v-else
        class="upload__form"
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
      isLoading: false,
      post: null
    };
  },
  created() {
    const { id } = this.$route.params;

    if (id) {
      this.fetchPost(id);
    }
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;

    if (id) {
      this.fetchPost(id);
    }

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

  &__info {
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    padding: 2rem;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
}
</style>
