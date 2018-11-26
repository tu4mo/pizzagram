<template>
  <keep-alive><RouterView /></keep-alive>
</template>

<style lang="scss">
:root {
  --color-gray: #aaa;
  --color-light: #eee;
  --color-pink: #df0054;
  --color-purple: #470032;

  --z-header: 1;
  --z-navigation: 2;
}

html {
  box-sizing: border-box;
  font-family: "Comfortaa", Helvetica, Arial, sans-serif;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-size: 0.75rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
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
