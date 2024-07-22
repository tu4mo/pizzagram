<template>
  <RouterLink :to="{ name: 'home' }" class="logo">
    <img
      alt="Pizzagram"
      class="logo__image"
      src="@/assets/pizzagram.png"
      width="300"
      height="90"
    />
  </RouterLink>
</template>

<style scoped>
  .logo {
    display: block;
    -webkit-tap-highlight-color: transparent;
  }

  .logo__image {
    display: block;
    max-height: 100%;
    width: auto;
  }
</style>
