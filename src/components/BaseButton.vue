<template>
  <button
    class="button"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  background-color: transparent;
  border: 0;
  border-radius: 0.5rem;
  color: $color-pink;
  font-size: 1rem;
  font-weight: bold;
  display: block;
  line-height: 2rem;
  outline: none;
  width: 100%;
}
</style>
