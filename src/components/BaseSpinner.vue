<template>
  <div :class="classes">
    <div class="spinner__rotate">
      <div class="spinner__pepperoni-1" />
      <div class="spinner__pepperoni-2" />
    </div>
  </div>
</template>

<script>
export default {
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
  computed: {
    classes() {
      return [
        "spinner",
        { "spinner--cover": this.cover, "spinner--inline": this.inline }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.spinner {
  align-items: center;
  bottom: 0;
  display: flex;
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
    animation: sk-rotate 1s infinite linear;
    width: 40px;
    height: 40px;
    position: relative;
    text-align: center;
  }

  &__pepperoni-1,
  &__pepperoni-2 {
    animation: sk-bounce 2s infinite ease-in-out;
    background-color: var(--color-pink);
    border: 4px solid var(--color-purple);
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
}

@keyframes sk-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1);
  }
}
</style>
