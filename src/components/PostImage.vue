<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[
      'post-image',
      { 'post-image--rounded': rounded, 'post-image--thumbnail': thumbnail },
    ]"
  >
    <img :src="actualUrl" alt="" class="post-image__image" loading="lazy" />
  </RouterLink>
  <div v-else :class="['post-image', { 'post-image--rounded': rounded }]">
    <img :src="actualUrl" alt="" class="post-image__image" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
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
  })

  const actualUrl = computed(() =>
    props.thumbnail ? props.imageUrl.replace('.jpg', '_t.jpg') : props.imageUrl
  )
</script>

<style scoped>
  .post-image {
    display: block;
    position: relative;
    transition: transform 0.2s ease;
  }

  .post-image::before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .post-image__image {
    background-color: var(--color-light);
    height: 100%;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .post-image__link:active .post-image__image {
    opacity: 0.8;
  }

  @media (min-width: 640px) {
    .post-image--thumbnail:hover {
      transform: scale(1.04);
    }

    .post-image--rounded .post-image__image {
      border-radius: 1rem;
    }
  }
</style>
