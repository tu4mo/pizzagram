<template>
  <figure class="post-image">
    <div class="post-image__container">
      <div
        :style="{ backgroundImage: `url(${imageUrl})` }"
        class="post-image__image"
      />
    </div>
    <figcaption
      v-if="caption"
      class="post-image__caption"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script>
export default {
  props: {
    caption: {
      default: "",
      type: String
    },
    imageUrl: {
      required: true,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.post-image {
  &__container {
    position: relative;

    &::before {
      content: "";
      display: block;
      padding-top: 100%;
    }
  }

  &__image {
    background-color: $color-light;
    background-position: 50% 50%;
    background-size: cover;
    border-radius: 1rem;
    bottom: 0;
    display: block;
    height: auto;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
  }

  &__caption {
    color: $color-purple-light;
    margin-top: 0.5rem;
  }
}
</style>
