<script setup lang="ts">
  import { computed } from 'vue'

  const { cover, inline } = defineProps<{ cover?: boolean; inline?: boolean }>()

  const classes = computed(() => [
    'spinner',
    { 'spinner--cover': cover, 'spinner--inline': inline },
  ])
</script>

<template>
  <div :class="classes">
    <div class="spinner__rotate">
      <div class="spinner__pepperoni-1" />
      <div class="spinner__pepperoni-2" />
    </div>
    <div v-if="!!$slots.default" class="spinner__slot"><slot /></div>
  </div>
</template>

<style scoped>
  .spinner {
    align-items: center;
    animation: animation-show 0.5s;
    display: flex;
    flex-direction: column;
    inset: 0;
    justify-content: center;
    position: fixed;
  }

  .spinner--cover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .spinner--inline {
    position: relative;
    margin: 1rem 0;
  }

  .spinner__rotate {
    animation: animation-rotate 1s infinite linear;
    width: 40px;
    height: 40px;
    position: relative;
    text-align: center;
  }

  .spinner__pepperoni-1,
  .spinner__pepperoni-2 {
    animation: animation-bounce 2s infinite ease-in-out;
    background-color: var(--color-primary);
    border: 4px solid var(--color-secondary);
    border-radius: 100%;
    display: inline-block;
    height: 30%;
    position: absolute;
    top: 0;
    width: 30%;
  }

  .spinner__pepperoni-2 {
    animation-delay: -1s;
    bottom: 0;
    top: auto;
  }

  .spinner__slot {
    margin-top: 2rem;
  }

  @keyframes animation-show {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes animation-rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes animation-bounce {
    0%,
    100% {
      transform: scale(0.5);
    }
    50% {
      transform: scale(1);
    }
  }
</style>
