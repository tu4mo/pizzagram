<template>
  <header :class="['header', { 'header--has-title': !!title }]">
    <TheLogo class="header__logo" />
    <div v-if="title" class="header__title">{{ title }}</div>
  </header>
</template>

<script>
import TheLogo from "./TheLogo";

export default {
  components: {
    TheLogo
  },
  props: {
    title: {
      default: null,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  align-items: center;
  display: flex;
  font-weight: bold;
  height: 4rem;
  justify-content: center;

  @media (min-width: 640px) {
    justify-content: flex-start;
  }

  &__logo {
    height: 2.5rem;

    .header--has-title & {
      display: none;

      @media (min-width: 640px) {
        display: block;
        margin-right: 1rem;
      }
    }
  }
}
</style>
