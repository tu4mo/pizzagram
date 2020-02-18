<template>
  <nav class="navigation">
    <div class="navigation__items">
      <NavItem
        :to="{ name: 'home' }"
        class="navigation__item"
        exact
        icon="home"
      >
        Home
      </NavItem>
      <TheCamera class="navigation__item" />
      <NavItem
        v-if="isDevelopment"
        :to="{ name: 'top' }"
        class="navigation__item"
        icon="star"
      >
        Top Posts
      </NavItem>
      <NavItem
        :badge="notifications"
        :to="{ name: 'notifications' }"
        class="navigation__item"
        icon="bell"
      >
        Notifications
      </NavItem>
      <NavItem
        :to="{ name: 'profile', params: { username: username || null } }"
        class="navigation__item"
        icon="user"
      >
        Profile
      </NavItem>
    </div>
  </nav>
</template>

<script lang="ts">
  import { computed, defineComponent } from "@vue/composition-api";

  import NavItem from "./NavItem.vue";
  import TheCamera from "./TheCamera.vue";

  export default defineComponent({
    components: {
      NavItem,
      TheCamera
    },
    setup(props, context) {
      const notifications = computed(() =>
        context.root.$store.getters.getNotifications.length > 0
          ? context.root.$store.getters.getNotifications.length
          : null
      );

      const isDevelopment = computed(
        () => process.env.NODE_ENV === "development"
      );

      const username = computed(() => context.root.$store.state.auth.username);

      return {
        notifications,
        isDevelopment,
        username
      };
    }
  });
</script>

<style lang="scss" scoped>
  .navigation {
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;

    @media (min-width: 640px) {
      padding-bottom: 0;
    }

    &__items {
      align-items: center;
      color: var(--color-secondary);
      display: flex;
      height: 3.5rem;
      justify-content: space-around;
    }

    &__item:not(:last-child) {
      @media (min-width: 640px) {
        margin-right: 2rem;
      }
    }
  }
</style>
