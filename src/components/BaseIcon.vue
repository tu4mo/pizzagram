<template>
  <div
    class="icon"
    v-html="icons[name]"
  />
</template>

<script>
import camera from "feather-icons/dist/icons/camera.svg";
import heart from "feather-icons/dist/icons/heart.svg";
import home from "feather-icons/dist/icons/home.svg";
import user from "feather-icons/dist/icons/user.svg";

export default {
  props: {
    name: {
      required: true,
      type: String
    }
  },
  created() {
    this.icons = {
      camera,
      heart,
      home,
      user
    };
  }
};
</script>

<style lang="scss" scoped>
.icon {
  cursor: inherit;

  /deep/ svg {
    display: block;
  }
}
</style>
