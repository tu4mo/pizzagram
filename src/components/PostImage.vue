<template>
  <figure class="post-image">
    <div class="post-image__container">
      <div v-lazy:background-image="imageUrl" class="post-image__image" />
    </div>
  </figure>
</template>

<script>
export default {
  props: {
    imageUrl: {
      default: null,
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
    background-color: var(--color-light);
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
}
</style>
