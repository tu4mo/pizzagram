<template>
  <div class="default-layout">
    <div
      :class="[
        'default-layout__top',
        { 'default-layout__top--border': hasScrolled },
      ]"
    >
      <div v-if="canGoBack" class="default-layout__back">
        <Button class="default-layout__button" secondary @click="router.go(-1)">
          <Icon name="chevronLeft" />
        </Button>
      </div>
      <div class="default-layout__header"><Header :title="title" /></div>
      <div v-if="authStore.isInitialized" class="default-layout__menu">
        <Menu />
      </div>
    </div>
    <div v-if="authStore.isInitialized" class="default-layout__navigation">
      <Navigation />
    </div>
    <main
      :class="[
        'default-layout__main',
        {
          'default-layout__main--from-top': fromTop,
          'default-layout__main--max-width': maxWidth,
        },
      ]"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import Button from '@/components/Button.vue'
  import Header from '@/components/Header.vue'
  import Icon from '@/components/Icon.vue'
  import Menu from '@/components/Menu.vue'
  import Navigation from '@/components/Navigation.vue'
  import { authStore } from '@/store/auth'

  type Props = {
    fromTop?: boolean
    maxWidth?: boolean
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    fromTop: false,
    maxWidth: false,
    title: undefined,
  })

  const route = useRoute()
  const router = useRouter()
  const hasScrolled = ref(false)

  const canGoBack = computed(
    () => route.name !== 'home' && window.history.length > 1,
  )

  function onScroll() {
    hasScrolled.value = window.scrollY > 0
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
</script>

<style scoped>
  .default-layout {
    background-color: var(--color-background);
  }

  .default-layout__top {
    border-bottom: 1px solid transparent;
    display: flex;
    justify-content: center;
    left: 0;
    padding: 0 2rem;
    padding-top: env(safe-area-inset-top);
    position: fixed;
    right: 0;
    transition: background-color 0.4s;
    top: 0;
    z-index: var(--z-header);
  }

  @media (min-width: 640px) {
    .default-layout__top {
      justify-content: space-between;
    }
  }

  .default-layout__top--border {
    background-color: rgba(var(--color-background-rgb), 0.8);
    backdrop-filter: blur(24px);
    border-color: var(--color-light);
  }

  .default-layout__back {
    align-items: center;
    display: flex;
    bottom: 0;
    position: absolute;
    left: 0;
    top: 0;
  }

  @media (min-width: 640px) {
    .default-layout__back {
      display: none;
    }
  }

  .default-layout__button {
    padding: 1rem;
  }

  .default-layout__main {
    margin: 0 auto;
    min-height: 100vh;
    padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
    padding-top: calc(4rem + env(safe-area-inset-top));
    position: relative;
  }

  .default-layout__main--from-top {
    padding-top: 0;
  }

  .default-layout__main--max-width {
    max-width: var(--content-width);
  }

  .default-layout__header {
    flex: 1 1 auto;
  }

  .default-layout__menu {
    align-items: center;
    bottom: 0;
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
  }

  @media (min-width: 640px) {
    .default-layout__menu {
      right: 1rem;
    }
  }

  .default-layout__navigation {
    align-items: center;
    background-color: rgba(var(--color-background-rgb), 0.8);
    backdrop-filter: blur(24px);
    border-top: 1px solid var(--color-light);
    bottom: 0;
    display: flex;
    left: 0;
    position: fixed;
    right: 0;
    z-index: var(--z-navigation);
  }

  @media (min-width: 640px) {
    .default-layout__navigation {
      background-color: transparent;
      backdrop-filter: none;
      border-top: 0;
      bottom: auto;
      left: auto;
      position: fixed;
      right: 5.5rem;
      top: 0.25rem;
    }
  }
</style>
