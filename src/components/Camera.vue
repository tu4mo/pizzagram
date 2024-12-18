<script setup lang="ts">
  import { useRouter } from 'vue-router'

  import { fileStore } from '@/store/file'

  const router = useRouter()

  function onChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      fileStore.file = file
    }
  }

  async function onClick() {
    fileStore.file = null

    if (router.currentRoute.value.name !== 'upload') {
      await router.push({ name: 'upload' })
    }
  }
</script>

<template>
  <input
    accept="image/*; capture=camera"
    type="file"
    @change="onChange"
    @click="onClick"
  />
</template>

<style scoped>
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
</style>
