<template>
  <div
    class="icon"
    v-html="$options.icons[name]"
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
  icons: {
    camera,
    home,
    user
  }
};
</script>

<style lang="scss" scoped>
.icon {
  /deep/ svg {
    display: block;
  }
}
</style>
