<template>
  <router-link :to="{ name: 'home' }" class="logo">
    <img alt="Pizzagram" class="logo__image" src="@/assets/pizzagram.png" />
  </router-link>
</template>

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
