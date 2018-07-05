<template>
  <figure class="post-image">
    <img
      :src="imageUrl"
      class="post-image__image"
    >
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
  &__image {
    border-radius: 1rem;
    display: block;
    height: auto;
    width: 100%;
  }

  &__caption {
    color: $color-purple-light;
    margin-top: 0.5rem;
  }
}
</style>
