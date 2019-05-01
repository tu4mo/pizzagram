<template>
  <keep-alive><RouterView /></keep-alive>
</template>

<script>
export default {
  metaInfo: {
    titleTemplate: titleChunk => {
      return titleChunk ? `${titleChunk} - Pizzagram` : "Pizzagram";
    }
  }
};
</script>

<style lang="scss">
:root {
  --color-background: #fff;
  --color-gray: #aaa;
  --color-light: #eee;
  --color-primary: #df0054;
  --color-secondary: #470032;
  --content-width: 640px;
  --content-width-lg: 1280px;

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
  background-color: var(--color-background);
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
