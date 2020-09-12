<template>
  <div :class="['icon', `icon--${size}`]" v-html="icon" />
</template>

<script lang="ts">
  // eslint-disable-next-line
  import { VNode } from 'vue'
  import { computed, defineComponent } from '@vue/composition-api'

  import bell from 'feather-icons/dist/icons/bell.svg'
  import camera from 'feather-icons/dist/icons/camera.svg'
  import chevronLeft from 'feather-icons/dist/icons/chevron-left.svg'
  import heart from 'feather-icons/dist/icons/heart.svg'
  import home from 'feather-icons/dist/icons/home.svg'
  import mapPin from 'feather-icons/dist/icons/map-pin.svg'
  import share from 'feather-icons/dist/icons/share.svg'
  import star from 'feather-icons/dist/icons/star.svg'
  import trash2 from 'feather-icons/dist/icons/trash-2.svg'
  import user from 'feather-icons/dist/icons/user.svg'

  export default defineComponent({
    props: {
      name: {
        required: true,
        type: String,
      },
      size: {
        default: 'md',
        type: String,
      },
    },
    setup(props) {
      const ICONS: { [key: string]: VNode } = {
        bell,
        camera,
        chevronLeft,
        heart,
        home,
        mapPin,
        share,
        star,
        trash2,
        user,
      }

      const icon = computed(() => ICONS[props.name])

      return {
        icon,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .icon {
    cursor: inherit;

    ::v-deep svg {
      display: block;
    }

    &--md ::v-deep svg {
      height: 1.5rem;
      width: 1.5rem;
    }

    &--sm ::v-deep svg {
      height: 1rem;
      width: 1rem;
    }
  }
</style>
