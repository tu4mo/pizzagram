<template>
  <RouterLink v-if="to" :to="to" class="post-image">
    <img v-lazy="imageUrl" class="post-image__image" />
  </RouterLink>
  <div v-else class="post-image">
    <img v-lazy="imageUrl" class="post-image__image" />
  </div>
</template>

<script lang="ts">
  import { createComponent } from "@vue/composition-api";

  export default createComponent({
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
  });
</script>

<style lang="scss" scoped>
  .post-image {
    display: block;
    position: relative;

    &::before {
      content: "";
      display: block;
      padding-top: 100%;
    }

    &__image {
      background-color: var(--color-light);
      height: 100%;
      left: 0;
      object-fit: cover;
      position: absolute;
      top: 0;
      width: 100%;

      @media (min-width: 640px) {
        border-radius: 1rem;
      }

      .post-image__link:active & {
        opacity: 0.8;
      }
    }
  }
</style>
