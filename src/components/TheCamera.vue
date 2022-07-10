<template>
  <div :class="['camera', { 'camera--active': $route.name === 'upload' }]">
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
  import { getCurrentInstance } from 'vue'

  import BaseIcon from './BaseIcon.vue'

  const instance = getCurrentInstance()

  const onChange = (event: any) => {
    if (event.target.files[0]) {
      instance?.proxy.$store.commit('setFile', event.target.files[0])
    }
  }

  const onClick = () => {
    instance?.proxy.$store.commit('setFile', null)

    if (instance?.proxy.$route.name !== 'upload') {
      instance?.proxy.$router.push({ name: 'upload' })
    }
  }
</script>

<style lang="scss" scoped>
  .camera {
    position: relative;

    &--active {
      color: var(--color-primary);
    }

    &__label {
      cursor: pointer;
      display: block;
      padding: 0.5rem;
    }

    &__input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  }
</style>
