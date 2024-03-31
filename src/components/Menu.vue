<template>
  <div ref="container" class="container">
    <Button
      :aria-pressed="isOpen"
      :secondary="!isOpen"
      class="button"
      @click="isOpen = !isOpen"
    >
      <Icon name="menu" />
    </Button>
    <div v-if="isOpen" ref="menu" class="menu">
      <template v-if="authStore.isAuthenticated">
        <button class="menu__item" @click="onLogOutClick">Log Out</button>
      </template>
      <template v-else>
        <button class="menu__item" @click="onLogInClick">Log In</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { signOut } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Icon from '@/components/Icon.vue'
  import { authStore } from '@/store/auth'

  const isOpen = ref(false)
  const container = ref<HTMLDivElement | null>(null)
  const router = useRouter()

  onMounted(() => {
    function closeMenu(event: MouseEvent) {
      if (!container.value?.contains(event.target as Node)) {
        isOpen.value = false
      }
    }

    window.addEventListener('click', closeMenu)

    return () => window.removeEventListener('click', closeMenu)
  })

  async function onLogOutClick() {
    isOpen.value = false
    await signOut()
    router.push({ name: 'home' })
  }

  async function onLogInClick() {
    isOpen.value = false
    router.push({ name: 'login' })
  }
</script>

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
    padding: 0.5rem;
    position: absolute;
    right: 0.5rem;
  }

  .menu__item {
    background-color: transparent;
    border: 0;
    border-radius: var(--radius-sm);
    color: var(--color-secondary);
    cursor: pointer;
    font-weight: bold;
    padding: 0.5rem 1rem;
    white-space: nowrap;
  }

  .menu__item:hover {
    background-color: var(--color-light);
  }

  .menu__item:active {
    background-color: var(--color-primary);
    color: var(--color-background);
  }
</style>
