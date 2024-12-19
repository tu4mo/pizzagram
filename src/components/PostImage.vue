<script setup lang="ts">
  import type { RouteLocationRaw } from 'vue-router'

  import { EMPTY_IMAGE } from '@/consts'

  const {
    alt = '',
    imageUrl = EMPTY_IMAGE,
    rounded,
    thumbnail,
    to = undefined,
  } = defineProps<{
    alt?: string
    imageUrl?: string
    rounded?: boolean
    thumbnail?: boolean
    to?: RouteLocationRaw
  }>()
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
    <img :src="imageUrl" :alt="alt" class="post-image__image" loading="lazy" />
  </RouterLink>
  <div v-else :class="['post-image', { 'post-image--rounded': rounded }]">
    <img :src="imageUrl" :alt="alt" class="post-image__image" loading="lazy" />
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
