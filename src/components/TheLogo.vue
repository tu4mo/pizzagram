<template>
  <RouterLink :to="{ name: 'home' }" class="logo">
    <img alt="Pizzagram" class="logo__image" src="@/assets/pizzagram.png" />
  </RouterLink>
</template>

<script lang="ts">
  import { defineComponent } from "@vue/composition-api";

  export default defineComponent({});
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
