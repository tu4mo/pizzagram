<template>
  <RouterLink
    v-if="asLink"
    :to="{ name: 'profile', params: { username: username } }"
  >
    <img :alt="username" :class="classes" :src="profileUrl" />
  </RouterLink>
  <img v-else :alt="username" :class="classes" :src="profileUrl" />
</template>

<script>
  export default {
    props: {
      asLink: {
        type: Boolean
      },
      size: {
        default: "small",
        type: String
      },
      user: {
        default: undefined,
        type: Object
      }
    },
    computed: {
      classes() {
        return ["profile-photo", `profile-photo--${this.size}`];
      },
      username() {
        return this.user ? this.user.username : "";
      },
      profileUrl() {
        return this.user && this.user.gravatar
          ? `https://www.gravatar.com/avatar/${this.user.gravatar}?d=identicon&s=128`
          : undefined;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .profile-photo {
    border-radius: 50%;
    display: block;
    object-fit: cover;

    &--small {
      height: 2rem;
      width: 2rem;

      @media (min-width: 640px) {
        height: 4rem;
        width: 4rem;
      }
    }

    &--medium {
      height: 4rem;
      width: 4rem;

      @media (min-width: 640px) {
        height: 8rem;
        width: 8rem;
      }
    }

    &--large {
      height: 8rem;
      width: 8rem;

      @media (min-width: 640px) {
        height: 16rem;
        width: 16rem;
      }
    }
  }
</style>
