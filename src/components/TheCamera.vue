<template>
  <div
    :class="[
      'camera',
      { 'camera--active': router.currentRoute.value.name === 'upload' },
    ]"
  >
    <label class="camera__label">
      <input
        accept="image/*; capture=camera"
        class="camera__input"
        type="file"
        @change="onChange"
        @click="onClick"
      />
      <BaseIcon name="camera" />
    </label>
  </div>
</template>

<script setup lang="ts">
  import BaseIcon from './BaseIcon.vue'
  import { fileStore } from '@/store/file'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      fileStore.file = file
    }
  }

  const onClick = () => {
    fileStore.file = null

    if (router.currentRoute.value.name !== 'upload') {
      router.push({ name: 'upload' })
    }
  }
</script>

<style scoped>
  .camera {
    position: relative;
  }

  .camera--active {
    color: var(--color-primary);
  }

  .camera__label {
    cursor: pointer;
    display: block;
    padding: 0.5rem;
  }

  .camera__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
</style>
