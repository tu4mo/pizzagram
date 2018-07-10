<template>
  <img
    :src="pizzagram"
    alt="Pizzagram"
    class="logo"
  >
</template>

<script>
import pizzagram from "@/assets/pizzagram.png";

export default {
  data() {
    return {
      pizzagram
    };
  }
};
</script>

<style lang="scss" scoped>
.logo {
  display: block;
  max-width: 100%;
}
</style>
