<template>
  <div class="empty">
    <slot />
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .empty {
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    padding: 2rem;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
