<template>
  <div class="default-layout">
    <div class="default-layout__top">
      <div class="default-layout__back">
        <BaseButton
          v-if="canGoBack"
          class="default-layout__back-link"
          @click="$router.go(-1)"
        >
          <BaseIcon name="chevronLeft" />
        </BaseButton>
      </div>
      <div class="default-layout__header"><TheHeader :title="title" /></div>
      <div class="default-layout__navigation"><TheNavigation /></div>
    </div>
    <main class="default-layout__main">
      <slot />
      <div class="default-layout__spacer" />
    </main>
  </div>
</template>

<script>
import BaseButton from "@/components/BaseButton";
import BaseIcon from "@/components/BaseIcon";
import TheHeader from "@/components/TheHeader";
import TheNavigation from "@/components/TheNavigation";

export default {
  components: {
    BaseButton,
    BaseIcon,
    TheHeader,
    TheNavigation
  },
  props: {
    title: {
      default: null,
      type: String
    }
  },
  computed: {
    canGoBack() {
      return this.$route.name !== "home" && window.history.length > 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.default-layout {
  background-color: #fff;

  &__top {
    background-color: #fff;
    border-bottom: 1px solid var(--color-light);
    display: flex;
    justify-content: center;
    left: 0;
    padding: 0 2rem;
    position: fixed;
    right: 0;
    top: 0;
    z-index: var(--z-header);

    @media (min-width: 640px) {
      justify-content: space-between;
    }
  }

  &__back {
    align-items: center;
    display: flex;
    bottom: 0;
    position: absolute;
    left: 0;
    top: 0;

    @media (min-width: 640px) {
      display: none;
    }
  }

  &__back-link {
    animation: fade-in 0.5s ease-in-out;
    padding: 1rem;
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 100%;
    }
  }

  &__main {
    margin: 0 auto;
    margin-bottom: 3.5rem;
    margin-top: 4rem;
    max-width: 640px;
    min-height: calc(100vh - 7.5rem);
    position: relative;
  }

  &__spacer {
    padding-bottom: env(safe-area-inset-bottom);
  }

  &__header {
    flex: 1 1 auto;
  }

  &__navigation {
    align-items: center;
    background-color: #fff;
    border-top: 1px solid var(--color-light);
    bottom: 0;
    display: flex;
    left: 0;
    position: fixed;
    right: 0;
    z-index: var(--z-navigation);

    @media (min-width: 640px) {
      border-top: 0;
      position: relative;
    }
  }
}
</style>
