<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <TheHeader />
    </div>
    <main class="default-layout__main">
      <slot />
      <div class="default-layout__spacer" />
    </main>
    <div class="default-layout__navigation">
      <TheNavigation />
    </div>
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";
import TheNavigation from "@/components/TheNavigation";

export default {
  components: {
    TheHeader,
    TheNavigation
  }
};
</script>

<style lang="scss" scoped>
.default-layout {
  background-color: #fff;

  &__header {
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: $z-header;
  }

  &__main {
    margin: 0 auto;
    margin-bottom: 3.5rem;
    margin-top: 4rem;
    max-width: 640px;
    min-height: calc(100vh - 7.5rem);
    position: relative;
  }

  &__spacer {
    padding-bottom: env(safe-area-inset-bottom);
  }

  &__navigation {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    z-index: $z-navigation;
  }
}
</style>
