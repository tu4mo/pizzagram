<template>
  <header class="header">
    <TheLogo class="header__logo" />
  </header>
</template>

<script>
import TheLogo from "./TheLogo";

export default {
  components: {
    TheLogo
  }
};
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;
  height: 4rem;
  justify-content: center;

  &__logo {
    height: 2.5rem;
  }
}
</style>
