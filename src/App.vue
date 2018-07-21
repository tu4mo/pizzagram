<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<style lang="scss">
html {
  box-sizing: border-box;
  font-family: "Comfortaa", Helvetica, Arial, sans-serif;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-size: 0.75rem;
}

*,
*::before,
*::after {
  box-sizing: inherit;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  padding: 0;
}
</style>
