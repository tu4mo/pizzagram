<script setup lang="ts">
  import { computed } from 'vue'
  import type { RouteLocationRaw } from 'vue-router'

  type Props = {
    alt?: string
    imageUrl: string
    rounded?: boolean
    thumbnail?: boolean
    to?: RouteLocationRaw
  }

  const props = withDefaults(defineProps<Props>(), { alt: '', to: undefined })

  const actualUrl = computed(() =>
    props.thumbnail ? props.imageUrl.replace('.jpg', '_t.jpg') : props.imageUrl,
  )
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[
      'post-image',
      { 'post-image--rounded': rounded, 'post-image--thumbnail': thumbnail },
    ]"
  >
    <img :src="actualUrl" :alt="alt" class="post-image__image" loading="lazy" />
  </RouterLink>
  <div v-else :class="['post-image', { 'post-image--rounded': rounded }]">
    <img :src="actualUrl" :alt="alt" class="post-image__image" loading="lazy" />
  </div>
</template>

<style scoped>
  .post-image {
    display: block;
    transition: transform 0.2s ease;
  }

  .post-image__image {
    aspect-ratio: 1 / 1;
    background-color: var(--color-light);
    display: block;
    object-fit: cover;
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
      border-radius: var(--radius-md);
    }
  }
</style>
