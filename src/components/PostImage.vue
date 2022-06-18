<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="['post-image', { 'post-image--rounded': rounded }]"
  >
    <img :src="actualUrl" alt="" class="post-image__image" loading="lazy" />
  </RouterLink>
  <div v-else :class="['post-image', { 'post-image--rounded': rounded }]">
    <img :src="actualUrl" alt="" class="post-image__image" loading="lazy" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  export default defineComponent({
    props: {
      imageUrl: {
        default: null,
        type: String,
      },
      rounded: {
        default: false,
        type: Boolean,
      },
      thumbnail: {
        default: false,
        type: Boolean,
      },
      to: {
        default: null,
        type: [String, Object],
      },
    },
    setup(props) {
      return {
        actualUrl: props.thumbnail
          ? props.imageUrl.replace('.jpg', '_t.jpg')
          : props.imageUrl,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .post-image {
    display: block;
    position: relative;

    &::before {
      content: '';
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

      .post-image__link:active & {
        opacity: 0.8;
      }

      .post-image--rounded & {
        @media (min-width: 640px) {
          border-radius: 1rem;
        }
      }
    }
  }
</style>
