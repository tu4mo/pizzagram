<template>
  <div class="post-image">
    <RouterLink v-if="to" :to="to" class="post-image__link">
      <figure class="post-image">
        <div class="post-image__container">
          <div v-lazy:background-image="imageUrl" class="post-image__image" />
        </div>
      </figure>
    </RouterLink>
    <figure v-else class="post-image">
      <div class="post-image__container">
        <div v-lazy:background-image="imageUrl" class="post-image__image" />
      </div>
    </figure>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      default: null,
      type: String
    },
    to: {
      default: null,
      type: [String, Object]
    }
  }
};
</script>

<style lang="scss" scoped>
.post-image {
  border-radius: 1rem;
  overflow: hidden;

  &__link:active {
    background-color: #000;
    display: block;
  }

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
    bottom: 0;
    display: block;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;

    .post-image__link:active & {
      opacity: 0.8;
    }
  }
}
</style>
