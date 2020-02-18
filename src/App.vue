<template>
  <keep-alive><RouterView /></keep-alive>
</template>

<script lang="ts">
  import { defineComponent } from "@vue/composition-api";

  export default defineComponent({
    metaInfo: {
      titleTemplate: titleChunk => {
        return titleChunk ? `${titleChunk} - Pizzagram` : "Pizzagram";
      }
    }
  });
</script>

<style lang="scss">
  :root {
    --color-background: #fff;
    --color-background-rgb: 255, 255, 255;
    --color-gray: #aaa;
    --color-light: #eee;
    --color-primary: #df0054;
    --color-secondary: #470032;
    --content-width: 640px;
    --content-width-lg: 960px;

    --z-header: 1;
    --z-navigation: 2;
  }

  html {
    box-sizing: border-box;
    font-family: "Comfortaa", Helvetica, Arial, sans-serif;
    touch-action: manipulation;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: var(--color-background);
    font-size: 0.75rem;
    line-height: 1.5;

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
