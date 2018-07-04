<template>
  <nav class="navigation">
    <NavItem
      :to="{ name: 'home' }"
      exact
      icon="home"
    >
      Home
    </NavItem>
    <NavItem
      :to="{ name: 'upload' }"
      icon="camera"
    >
      Upload
    </NavItem>
    <NavItem
      :to="{ name: 'profile' }"
      icon="user"
    >
      Profile
    </NavItem>
  </nav>
</template>

<script>
import NavItem from "./NavItem";

export default {
  components: {
    NavItem
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  align-items: center;
  background-color: #fff;
  border-top: 1px solid $color-light;
  display: flex;
  height: 3.5rem;
  justify-content: space-around;
}
</style>
