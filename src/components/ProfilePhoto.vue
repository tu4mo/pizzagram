<template>
  <div
    :class="['profile-photo', `profile-photo--${size}`]"
    :style="{ backgroundImage: `url(${profileUrl})` }"
  />
</template>

<script>
export default {
  props: {
    gravatar: {
      default: "",
      type: String
    },
    size: {
      default: "small",
      type: String
    }
  },
  computed: {
    profileUrl() {
      return this.gravatar
        ? `https://www.gravatar.com/avatar/${this.gravatar}?d=identicon`
        : null;
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-photo {
  background-color: var(--color-light);
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;

  &--small {
    height: 2rem;
    width: 2rem;
  }

  &--medium {
    height: 4rem;
    width: 4rem;
  }
}
</style>
