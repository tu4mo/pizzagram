<script setup lang="ts">
  import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
  import { useRouter } from 'vue-router'

  import { signOut } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Icon from '@/components/Icon.vue'
  import { authStore } from '@/store/auth'

  const isOpen = ref(false)
  const container = useTemplateRef('container')
  const router = useRouter()

  function closeMenu(event: MouseEvent) {
    if (!container.value?.contains(event.target as Node)) {
      isOpen.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('click', closeMenu)
  })

  onUnmounted(() => {
    window.removeEventListener('click', closeMenu)
  })

  async function onLogOutClick() {
    isOpen.value = false
    await signOut()
    await router.push({ name: 'home' })
  }

  async function onLogInClick() {
    isOpen.value = false
    await router.push({ name: 'login' })
  }
</script>

<template>
  <div ref="container" class="container">
    <Button
      :aria-pressed="isOpen"
      :secondary="!isOpen"
      aria-label="Menu"
      class="button"
      @click="isOpen = !isOpen"
    >
      <Icon name="menu" />
    </Button>
    <div :class="['menu', { 'menu--open': isOpen }]">
      <template v-if="authStore.isAuthenticated">
        <RouterLink class="menu__item" to="/account">Account</RouterLink>
        <hr />
        <button class="menu__item" @click="onLogOutClick">Log Out</button>
      </template>
      <template v-else>
        <button class="menu__item" @click="onLogInClick">Log In</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: relative;
  }

  .button {
    padding: 1rem;
  }

  .menu {
    background-color: var(--color-background);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: none;
    opacity: 0;
    padding: 0.5rem;
    position: absolute;
    right: 0.5rem;
    transform: translateY(-0.5rem) scale(0.9);
    transform-origin: top right;
    transition: all var(--transition-fast) allow-discrete;
  }

  .menu--open {
    display: block;
    opacity: 1;
    transform: translateY(0) scale(1);

    @starting-style {
      opacity: 0;
      transform: translateY(-0.5rem) scale(0.9);
    }
  }

  .menu__item {
    background-color: transparent;
    border: 0;
    border-radius: var(--radius-sm);
    color: var(--color-secondary);
    cursor: pointer;
    display: block;
    font-weight: bold;
    padding: 0.5rem 1rem;
    text-align: left;
    text-decoration: none;
    white-space: nowrap;
    width: 100%;

    &:hover,
    &[aria-current='page'] {
      background-color: var(--color-light);
    }

    &:active {
      background-color: var(--color-primary);
      color: var(--color-background);
    }
  }

  hr {
    border: 0;
    border-top: 1px solid var(--color-light);
    margin: 0.5rem 0;
  }
</style>
