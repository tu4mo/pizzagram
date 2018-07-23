<template>
  <div :class="['camera', { 'camera--active': $route.name === 'upload' }]">
    <label>
      <input
        accept="image/*; capture=camera"
        class="camera__input"
        type="file"
        @change="onChange"
        @click="$router.push({ name: 'upload' })"
      >
      <BaseIcon name="camera" />
    </label>
  </div>
</template>

<script>
import BaseIcon from "./BaseIcon";

export default {
  components: {
    BaseIcon
  },
  methods: {
    onChange(event) {
      if (event.target.files[0]) {
        this.$store.commit("setFile", event.target.files[0]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.camera {
  position: relative;

  &--active {
    color: var(--color-pink);
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
