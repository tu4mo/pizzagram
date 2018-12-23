<template>
  <DefaultLayout>
    <div class="upload">
      <div v-if="!file || !imageUrl" class="upload__info">
        Use the Camera icon to upload a photo
      </div>
      <div v-else class="upload__form">
        <BaseSpacer mb1> <PostImage :image-url="imageUrl" /> </BaseSpacer>
        <BaseSpacer mb1>
          <BaseInput
            v-model.trim="caption"
            maxlength="100"
            placeholder="Caption"
          />
        </BaseSpacer>
        <BaseButton @click="onShareClick">Share</BaseButton>
      </div>
      <BaseSpinner v-if="isLoading" cover />
      <canvas ref="canvas" class="upload__canvas" width="1024" height="1024" />
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
      isDetectingPizza: false,
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
      if (newFile) {
        this.imageUrl = "";
        this.reader.readAsDataURL(newFile);
      }
    }
  },
  created() {
    this.reader = new FileReader();
    this.reader.addEventListener("load", this.onFileLoad);
  },
  destroyed() {
    this.reader.removeEventListener("load", this.onFileLoad);
  },
  methods: {
    async onFileLoad() {
      this.isLoading = true;

      this.imageUrl = this.reader.result;

      const { canvas } = this.$refs;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        const cocoSsd = await import("@tensorflow-models/coco-ssd");

        const image = new Image();
        image.src = this.reader.result;
        image.onload = async () => {
          const hRatio = canvas.width / image.width;
          const vRatio = canvas.height / image.height;
          const ratio = Math.min(hRatio, vRatio);

          ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            image.width * ratio,
            image.height * ratio
          );

          const model = await cocoSsd.load();
          const predictions = await model.detect(this.$refs.canvas, 1);

          const isPizza = predictions.some(
            prediction => prediction.class === "pizza"
          );

          if (!isPizza) {
            alert(
              "Sorry, couldn't find a pizza in the photo. Try another one."
            );
            this.imageUrl = "";
          }

          this.isLoading = false;
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async onShareClick() {
      this.isLoading = true;

      await Firebase.sharePost(this.file, this.caption);
      this.$store.commit("setFile", null);

      this.$store.commit("clearFeed", "home");
      this.$store.dispatch("getPostsForHome", true);

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

  &__canvas {
    display: none;
    width: 100%;
  }
}
</style>
