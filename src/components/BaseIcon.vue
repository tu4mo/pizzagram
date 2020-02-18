<template functional>
  <div class="icon" v-html="$options.ICONS[props.name]" />
</template>

<script>
  import bell from 'feather-icons/dist/icons/bell.svg'
  import camera from 'feather-icons/dist/icons/camera.svg'
  import chevronLeft from 'feather-icons/dist/icons/chevron-left.svg'
  import heart from 'feather-icons/dist/icons/heart.svg'
  import home from 'feather-icons/dist/icons/home.svg'
  import share from 'feather-icons/dist/icons/share.svg'
  import star from 'feather-icons/dist/icons/star.svg'
  import trash2 from 'feather-icons/dist/icons/trash-2.svg'
  import user from 'feather-icons/dist/icons/user.svg'

  export default {
    ICONS: {
      bell,
      camera,
      chevronLeft,
      heart,
      home,
      share,
      star,
      trash2,
      user
    },
    props: {
      name: {
        required: true,
        type: String
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon {
    cursor: inherit;

    /deep/ svg {
      display: block;
    }
  }
</style>
