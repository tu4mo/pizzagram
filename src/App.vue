<script setup lang="ts">
  import Spinner from './components/Spinner.vue'
  import { authStore } from './store/auth'
</script>

<template>
  <Spinner v-if="!authStore.isInitialized" />
  <RouterView v-else v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>

<style>
  :root {
    --button-scale: scale(0.94);

    --blur: blur(24px);

    --color-background: #fff;
    --color-background-rgb: 255, 255, 255;
    --color-gray: #aaa;
    --color-light: #eee;
    --color-primary: #df0054;
    --color-secondary: #470032;

    --content-width: 740px;
    --content-width-lg: 960px;

    --font-size-sm: 0.75rem;
    --font-size-md: 1rem;

    --radius-xs: 0.25rem;
    --radius-sm: 0.5rem;
    --radius-md: 1rem;
    --radius-lg: 2rem;

    --shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.1);

    --transition-fast: 200ms ease;

    --z-header: 1;
    --z-navigation: 2;
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

  html {
    box-sizing: border-box;
    font-family: 'DM Sans', Helvetica, Arial, sans-serif;
    touch-action: manipulation;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: var(--color-background);
    font-size: var(--font-size-md);
    line-height: 1.5;
  }

  @media (display-mode: standalone) {
    html {
      -webkit-touch-callout: none;
    }

    a {
      -webkit-user-drag: none;
    }
  }
</style>
