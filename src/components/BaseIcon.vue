<template>
  <div
    class="base-icon"
    v-html="$data[name]"
  />
</template>

<script>
import camera from "feather-icons/dist/icons/camera.svg";
import home from "feather-icons/dist/icons/home.svg";
import user from "feather-icons/dist/icons/user.svg";

export default {
  props: {
    name: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      camera,
      home,
      user
    };
  }
};
</script>

<style lang="scss" scoped>
.base-icon {
  /deep/ svg {
    display: block;
  }
}
</style>
