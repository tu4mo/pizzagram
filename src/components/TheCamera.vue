<template>
  <div class="camera">
    <label>
      <input
        accept="image/*; capture=camera"
        class="camera__input"
        type="file"
        @change="onChange"
      >
      <BaseIcon name="camera" />
    </label>
  </div>
</template>

<script>
import BaseIcon from "./BaseIcon";

import { createPost } from "@/firebase";

export default {
  components: {
    BaseIcon
  },
  methods: {
    async onChange(event) {
      if (event.target.files[0]) {
        const id = await createPost(event.target.files[0]);
        this.$router.push({ name: "upload", params: { id } });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.camera {
  position: relative;

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
