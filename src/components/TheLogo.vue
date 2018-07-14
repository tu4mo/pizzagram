<template>
  <router-link
    :to="{ name: 'home' }"
    class="logo"
  >
    <img
      :src="pizzagram"
      alt="Pizzagram"
      class="logo__image"
    >
  </router-link>
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
  -webkit-tap-highlight-color: transparent;

  &__image {
    display: block;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
