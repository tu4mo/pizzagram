<template>
  <div class="empty">
    <slot />
  </div>
</template>

<style scoped>
  .empty {
    align-items: center;
    display: flex;
    justify-content: center;
    inset: 0;
    padding: 2rem;
    position: absolute;
  }
</style>
