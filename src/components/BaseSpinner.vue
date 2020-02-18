<template>
  <div :class="classes">
    <div class="spinner__rotate">
      <div class="spinner__pepperoni-1" />
      <div class="spinner__pepperoni-2" />
    </div>
    <div v-if="!!$slots.default" class="spinner__slot"><slot /></div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from '@vue/composition-api'

  export default defineComponent({
    props: {
      cover: {
        default: false,
        type: Boolean
      },
      inline: {
        default: false,
        type: Boolean
      }
    },
    setup(props) {
      const classes = computed(() => [
        'spinner',
        { 'spinner--cover': props.cover, 'spinner--inline': props.inline }
      ])

      return { classes }
    }
  })
</script>

<style lang="scss" scoped>
  .spinner {
    align-items: center;
    animation: animation-show 0.5s;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;

    &--cover {
      background-color: rgba(255, 255, 255, 0.9);
    }

    &--inline {
      position: relative;
    }

    &__rotate {
      animation: animation-rotate 1s infinite linear;
      width: 40px;
      height: 40px;
      position: relative;
      text-align: center;
    }

    &__pepperoni-1,
    &__pepperoni-2 {
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

    &__pepperoni-2 {
      animation-delay: -1s;
      bottom: 0;
      top: auto;
    }

    &__slot {
      margin-top: 2rem;
    }
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
