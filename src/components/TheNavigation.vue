<template>
  <nav class="navigation">
    <div class="navigation__items">
      <NavItem
        :to="{ name: 'home' }"
        exact
        icon="home"
      >
        Home
      </NavItem>
      <TheCamera />
      <NavItem
        :to="{ name: 'profile', params: { username: username || null } }"
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
    username() {
      return this.$store.state.auth.username;
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  background-color: #fff;
  border-top: 1px solid var(--color-light);
  padding-bottom: env(safe-area-inset-bottom);

  &__items {
    align-items: center;
    display: flex;
    height: 3.5rem;
    justify-content: space-around;
  }
}
</style>
