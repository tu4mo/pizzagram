<template>
  <div
    :class="['icon', `icon--${size}`, { 'icon--fill': fill }]"
    v-html="icon"
  />
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue'

  import bell from 'feather-icons/dist/icons/bell.svg?raw'
  import camera from 'feather-icons/dist/icons/camera.svg?raw'
  import chevronLeft from 'feather-icons/dist/icons/chevron-left.svg?raw'
  import heart from 'feather-icons/dist/icons/heart.svg?raw'
  import home from 'feather-icons/dist/icons/home.svg?raw'
  import mapPin from 'feather-icons/dist/icons/map-pin.svg?raw'
  import share from 'feather-icons/dist/icons/share.svg?raw'
  import star from 'feather-icons/dist/icons/star.svg?raw'
  import trash2 from 'feather-icons/dist/icons/trash-2.svg?raw'
  import user from 'feather-icons/dist/icons/user.svg?raw'

  export default defineComponent({
    props: {
      fill: {
        default: false,
        type: Boolean,
      },
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
      const ICONS: { [key: string]: string } = {
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

    &--fill ::v-deep svg {
      fill: currentColor;
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
