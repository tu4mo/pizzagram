<template>
  <DefaultLayout>
    <div class="upload">
      <div
        v-if="!file || !imageUrl"
        class="upload__info"
      >
        Use the Camera icon to upload a photo
      </div>
      <div
        v-else
        class="upload__form"
      >
        <BaseSpacer mb1>
          <PostImage :image-url="imageUrl" />
        </BaseSpacer>
        <BaseSpacer mb1>
          <BaseInput
            v-model="caption"
            maxlength="100"
            placeholder="Caption"
          />
        </BaseSpacer>
        <BaseButton @click="onShareClick">Share</BaseButton>
      </div>
      <BaseSpinner
        v-if="isLoading"
        cover
      />
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

import Firebase from "@/firebase";

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
      imageUrl: "",
      isLoading: false
    };
  },
  computed: {
    file() {
      return this.$store.state.file;
    }
  },
  watch: {
    file(newFile) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => (this.imageUrl = reader.result),
        false
      );

      if (newFile) {
        reader.readAsDataURL(newFile);
      }
    }
  },
  methods: {
    async onShareClick() {
      this.isLoading = true;
      await Firebase.sharePost(this.file, this.caption);
      this.$store.commit("setFile", null);
      this.caption = "";
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
