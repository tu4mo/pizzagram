<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <Header />
    </div>
    <main class="default-layout__main">
      <slot />
    </main>
    <div class="default-layout__footer">
      <Navigation />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default {
  components: {
    Header,
    Navigation
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
