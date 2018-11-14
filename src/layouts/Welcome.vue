<template>
  <div class="welcome-layout">
    <div class="welcome-layout__header"><TheHeader /></div>
    <main class="welcome-layout__main"><slot /></main>
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";

export default {
  components: {
    TheHeader
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

  &__header {
    border-bottom: 1px solid var(--color-light);
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: var(--z-header);
  }

  &__main {
    margin: 0 auto;
    max-width: 640px;
    width: 100%;
  }
}
</style>
