<template>
  <div class="empty">
    <slot />
  </div>
</template>

<style scoped>
  .empty {
    display: flex;
    inset: 0;
    padding: 2rem;
    place-items: center;
    position: absolute;
  }
</style>
