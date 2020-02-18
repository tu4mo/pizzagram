<template>
  <div class="empty">
    <slot />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "@vue/composition-api";

  export default defineComponent({});
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
