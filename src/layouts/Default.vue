<template>
  <div class="default-layout">
    <div
      :class="[
        'default-layout__top',
        { 'default-layout__top--border': hasScrolled }
      ]"
    >
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
    </div>
    <div v-if="isAuthenticated" class="default-layout__navigation">
      <TheNavigation />
    </div>
    <main
      :class="[
        'default-layout__main',
        {
          'default-layout__main--from-top': fromTop,
          'default-layout__main--max-width': maxWidth
        }
      ]"
    >
      <slot />
      <div class="default-layout__spacer" />
    </main>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    ref
  } from "@vue/composition-api";

  import BaseButton from "@/components/BaseButton.vue";
  import BaseIcon from "@/components/BaseIcon.vue";
  import TheHeader from "@/components/TheHeader.vue";
  import TheNavigation from "@/components/TheNavigation.vue";

  export default defineComponent({
    components: {
      BaseButton,
      BaseIcon,
      TheHeader,
      TheNavigation
    },
    props: {
      maxWidth: {
        default: false,
        type: Boolean
      },
      title: {
        default: null,
        type: String
      },
      fromTop: {
        default: false,
        type: Boolean
      }
    },
    setup(props, context) {
      const hasScrolled = ref(false);

      const canGoBack = computed(
        () => context.root.$route.name !== "home" && window.history.length > 1
      );

      const isAuthenticated = computed(
        () => context.root.$store.state.auth.isAuthenticated
      );

      const onScroll = () => {
        hasScrolled.value = window.scrollY > 0;
      };

      onMounted(() => {
        window.addEventListener("scroll", onScroll);
      });

      onUnmounted(() => {
        window.removeEventListener("scroll", onScroll);
      });

      return {
        hasScrolled,
        canGoBack,
        isAuthenticated
      };
    }
  });
</script>

<style lang="scss" scoped>
  .default-layout {
    background-color: var(--color-background);

    &__top {
      border-bottom: 1px solid transparent;
      display: flex;
      justify-content: center;
      left: 0;
      padding: 0 2rem;
      position: fixed;
      right: 0;
      transition: background-color 0.4s;
      top: 0;
      z-index: var(--z-header);

      @media (min-width: 640px) {
        justify-content: space-between;
      }

      &--border {
        background-color: rgba(var(--color-background-rgb), 0.8);
        backdrop-filter: blur(24px);
        border-color: var(--color-light);
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
      padding: 1rem;
    }

    &__main {
      margin: 0 auto;
      margin-bottom: 3.5rem;
      min-height: calc(100vh - 7.5rem);
      padding-top: 4rem;
      position: relative;

      &--from-top {
        padding-top: 0;
      }

      &--max-width {
        max-width: var(--content-width);
      }
    }

    &__spacer {
      padding-bottom: env(safe-area-inset-bottom);
    }

    &__header {
      flex: 1 1 auto;
    }

    &__navigation {
      align-items: center;
      background-color: rgba(var(--color-background-rgb), 0.8);
      backdrop-filter: blur(24px);
      border-top: 1px solid var(--color-light);
      bottom: 0;
      display: flex;
      left: 0;
      position: fixed;
      right: 0;
      z-index: var(--z-navigation);

      @media (min-width: 640px) {
        background-color: transparent;
        backdrop-filter: none;
        border-top: 0;
        bottom: auto;
        left: auto;
        margin-right: 2rem;
        position: fixed;
        right: 0;
        top: 0.25rem;
      }
    }
  }
</style>
