<template>
  <RouterLink :active-class="activeClass" :exact="exact" :to="to" class="link">
    <slot />
  </RouterLink>
</template>

<script lang="ts">
  import { defineComponent } from "@vue/composition-api";

  export default defineComponent({
    props: {
      activeClass: {
        default: null,
        type: String
      },
      exact: {
        default: false,
        type: Boolean
      },
      to: {
        required: true,
        type: Object
      }
    }
  });
</script>

<style lang="scss" scoped>
  .link {
    color: var(--color-primary);
    text-decoration: none;
  }
</style>
