<template>
  <BaseLink
    :exact="exact"
    :to="to"
    active-class="nav-item--active"
    class="nav-item"
  >
    <BaseIcon :name="icon" />
    <div v-if="badge" class="nav-item__badge">{{ badge }}</div>
  </BaseLink>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  import BaseIcon from './BaseIcon.vue'
  import BaseLink from './BaseLink.vue'

  export default defineComponent({
    components: {
      BaseIcon,
      BaseLink,
    },
    props: {
      badge: {
        default: null,
        type: [Number, String],
      },
      exact: {
        default: false,
        type: Boolean,
      },
      icon: {
        required: true,
        type: String,
      },
      to: {
        required: true,
        type: Object,
      },
    },
  })
</script>

<style lang="scss" scoped>
  .nav-item {
    color: var(--color-secondary);
    position: relative;

    &--active {
      color: var(--color-primary);
    }

    &__badge {
      align-items: center;
      background-color: var(--color-primary);
      border-radius: 1rem;
      color: #fff;
      display: flex;
      height: 1rem;
      justify-content: center;
      line-height: 1;
      min-width: 1rem;
      padding: 0 0.25rem;
      position: absolute;
      right: -0.375rem;
      top: -0.375rem;
    }
  }
</style>
