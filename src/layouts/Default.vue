<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <TheHeader />
    </div>
    <main class="default-layout__main">
      <slot />
    </main>
    <div class="default-layout__footer">
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
  &__header {
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  &__main {
    bottom: 3.5rem;
    left: 0;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 4rem;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
  }
}
</style>
