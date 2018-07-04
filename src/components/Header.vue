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
  border-bottom: 1px solid #eee;
  display: flex;
  height: 4rem;
  justify-content: center;

  &__logo {
    height: 2.5rem;
  }
}
</style>
