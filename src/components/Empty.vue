<template>
  <div class="empty">
    <slot />
  </div>
</template>

<style scoped>
  .empty {
    align-items: center;
    display: flex;
    inset: 0;
    justify-content: center;
    padding: 2rem;
    position: absolute;
  }
</style>
