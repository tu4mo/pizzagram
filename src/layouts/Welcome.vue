<template>
  <div class="welcome-layout">
    <TheLogo class="welcome-layout__logo" />
    <slot />
  </div>
</template>

<script>
import TheLogo from "@/components/TheLogo";

export default {
  components: {
    TheLogo
  }
};
</script>

<style lang="scss" scoped>
.welcome-layout {
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  padding: 2rem;
  position: absolute;
  right: 0;
  top: 0;

  &__logo {
    height: 2.5rem;
    margin: 0 auto;
    margin-bottom: 2rem;
  }
}
</style>
