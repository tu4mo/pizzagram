<template>
  <header class="header">
    <img
      :src="pizzagram"
      class="header__logo"
    >
  </header>
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
.header {
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid $color-light;
  display: flex;
  height: 4rem;
  justify-content: center;

  &__logo {
    height: 2.5rem;
  }
}
</style>
