<template>
  <DefaultLayout>
    <div class="upload">
      <BaseEmpty v-if="!file || !imageUrl">
        Use the Camera icon to upload a photo
      </BaseEmpty>
      <div v-else>
        <div class="upload__image">
          <PostImage ref="image" :image-url="imageUrl" />
        </div>
        <div class="upload__form">
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
      </div>
      <BaseSpinner v-if="isLoading" cover />
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
    onFileLoad() {
      this.isLoading = true;

      this.getNearbyLocations();

      this.imageUrl = this.reader.result;

      this.$nextTick(async () => {
        try {
          const cocoSsd = await import("@tensorflow-models/coco-ssd");
          const model = await cocoSsd.load();
          const image = this.$refs.image.$el.querySelector("img");
          const predictions = await model.detect(image, 1);

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
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      });
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

  @media (min-width: 640px) {
    padding: 2rem;
  }

  &__canvas {
    display: none;
    width: 100%;
  }

  &__form {
    padding: 2rem;

    @media (min-width: 640px) {
      padding: 2rem 0;
    }
  }
}
</style>
