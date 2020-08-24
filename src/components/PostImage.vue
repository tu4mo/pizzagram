<template>
  <div
    v-observe-visibility="{
      callback: onVisibilityChanged,
      intersection: { rootMargin: '512px' },
      once: true,
    }"
  >
    <RouterLink
      v-if="to"
      :to="to"
      :class="['post-image', { 'post-image--rounded': rounded }]"
    >
      <img :src="actualUrl" alt="" class="post-image__image" />
    </RouterLink>
    <div v-else :class="['post-image', { 'post-image--rounded': rounded }]">
      <img :src="actualUrl" alt="" class="post-image__image" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from '@vue/composition-api'

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
      to: {
        default: null,
        type: [String, Object],
      },
    },
    setup(props) {
      const actualUrl = ref('')

      const onVisibilityChanged = (isVisible: boolean) => {
        if (!isVisible) {
          return
        }

        actualUrl.value = props.imageUrl
      }

      return {
        actualUrl,
        onVisibilityChanged,
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
