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
    },
    onClick() {
      this.$store.commit("setFile", null);
      this.$router.push({ name: "upload" });
    }
  }
};
</script>

<style lang="scss" scoped>
.camera {
  position: relative;

  &--active {
    color: var(--color-primary);
  }

  &__label {
    cursor: pointer;
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
