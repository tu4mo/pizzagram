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
        v-if="isDevelopment"
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

<script>
  import NavItem from "./NavItem";
  import TheCamera from "./TheCamera";

  export default {
    components: {
      NavItem,
      TheCamera
    },
    computed: {
      notifications() {
        return this.$store.getters.getNotifications.length > 0
          ? this.$store.getters.getNotifications.length
          : null;
      },
      isDevelopment() {
        return process.env.NODE_ENV === "development";
      },
      username() {
        return this.$store.state.auth.username;
      }
    }
  };
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
