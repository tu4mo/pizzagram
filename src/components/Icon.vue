<script setup lang="ts">
  import bell from 'feather-icons/dist/icons/bell.svg?raw'
  import camera from 'feather-icons/dist/icons/camera.svg?raw'
  import chevronLeft from 'feather-icons/dist/icons/chevron-left.svg?raw'
  import heart from 'feather-icons/dist/icons/heart.svg?raw'
  import home from 'feather-icons/dist/icons/home.svg?raw'
  import mapPin from 'feather-icons/dist/icons/map-pin.svg?raw'
  import menu from 'feather-icons/dist/icons/menu.svg?raw'
  import messageCircle from 'feather-icons/dist/icons/message-circle.svg?raw'
  import rotateCw from 'feather-icons/dist/icons/rotate-cw.svg?raw'
  import share from 'feather-icons/dist/icons/share.svg?raw'
  import star from 'feather-icons/dist/icons/star.svg?raw'
  import trash2 from 'feather-icons/dist/icons/trash-2.svg?raw'
  import user from 'feather-icons/dist/icons/user.svg?raw'
  import x from 'feather-icons/dist/icons/x.svg?raw'
  import { computed } from 'vue'

  const { fill, name } = defineProps<{
    fill?: boolean
    name: keyof typeof ICONS
  }>()

  const ICONS = {
    bell,
    camera,
    chevronLeft,
    heart,
    home,
    mapPin,
    menu,
    messageCircle,
    rotateCw,
    share,
    star,
    trash2,
    user,
    x,
  }

  const icon = computed(() => ICONS[name])
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div :class="['icon', { 'icon--fill': fill }]" v-html="icon" />
  <!-- eslint-enable -->
</template>

<style scoped>
  .icon {
    cursor: inherit;
  }

  .icon:deep(svg) {
    display: block;
  }

  .icon--fill:deep(svg) {
    fill: currentColor;
  }
</style>
