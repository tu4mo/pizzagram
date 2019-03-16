<template>
  <DefaultLayout>
    <div class="upload">
      <BaseEmpty v-if="!file || !imageUrl">
        Use the Camera icon to upload a photo
      </BaseEmpty>
      <div v-else class="upload__form">
        <BaseSpacer mb2> <PostImage :image-url="imageUrl" /> </BaseSpacer>
        <BaseSpacer mb2>
          <BaseField label="Caption">
            <BaseInput v-model.trim="form.caption" maxlength="100" />
          </BaseField>
        </BaseSpacer>
        <BaseSpacer mb2>
          <BaseField label="Rating">
            <BaseRating
              :value="form.rating"
              @change="rating => (form.rating = rating)"
            />
          </BaseField>
        </BaseSpacer>
        <BaseSpacer v-if="isLocationEnabled" mb2>
          <BaseField label="Restaurant">
            <BaseSelect
              :options="locations"
              :value="form.location"
              name="location"
              @change="location => (form.location = location)"
            />
          </BaseField>
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
import BaseEmpty from "@/components/BaseEmpty";
import BaseField from "@/components/BaseField";
import BaseRating from "@/components/BaseRating";
import BaseSelect from "@/components/BaseSelect";
import BaseSpacer from "@/components/BaseSpacer";
import BaseSpinner from "@/components/BaseSpinner";
import BaseInput from "@/components/BaseInput";
import PostImage from "@/components/PostImage";

import Firebase from "@/firebase";

export default {
  components: {
    BaseButton,
    BaseEmpty,
    BaseField,
    BaseRating,
    BaseSelect,
    BaseSpacer,
    BaseSpinner,
    BaseInput,
    DefaultLayout,
    PostImage
  },
  data() {
    return {
      form: {
        caption: "",
        latitude: null,
        longitude: null,
        location: "",
        rating: 0
      },
      imageUrl: "",
      isDetectingPizza: false,
      isLoading: false,
      isLocationEnabled: false,
      locations: []
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
    getNearbyLocations() {
      this.isLocationEnabled = false;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
          this.form.latitude = coords.latitude;
          this.form.longitude = coords.longitude;

          const locations = await Firebase.getNearbyLocations(
            this.form.latitude,
            this.form.longitude
          );

          this.locations = locations.map(location => ({
            label: location.name,
            value: location.name
          }));

          this.isLocationEnabled = true;
        });
      }
    },
    async onFileLoad() {
      this.isLoading = true;

      this.getNearbyLocations();

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

      await Firebase.sharePost({ file: this.file, ...this.form });
      this.$store.commit("setFile", null);

      if (
        this.form.location &&
        !this.locations.some(location => location.label === this.form.location)
      ) {
        await Firebase.addLocation({
          name: this.form.location,
          latitude: this.form.latitude,
          longitude: this.form.longitude
        });
      }

      this.$store.commit("clearFeed", "home");
      this.$store.dispatch("getPostsForHome", true);

      this.resetForm();

      this.isLoading = false;

      this.$router.push({ name: "home" });
    },
    resetForm() {
      this.form.caption = "";
      this.form.location = "";
      this.form.rating = 0;
      this.form.latitude = null;
      this.form.longitude = null;
    }
  },
  metaInfo: {
    title: "Upload"
  }
};
</script>

<style lang="scss" scoped>
.upload {
  margin: 0 auto;
  max-width: var(--content-width);
  padding: 2rem;

  &__canvas {
    display: none;
    width: 100%;
  }
}
</style>
