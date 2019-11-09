<template>
  <img
    :alt="alt"
    :class="['profile-photo', `profile-photo--${size}`]"
    :src="profileUrl"
  />
</template>

<script>
  export default {
    props: {
      alt: {
        default: "",
        type: String
      },
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
          ? `https://www.gravatar.com/avatar/${this.gravatar}?d=identicon&s=128`
          : null;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .profile-photo {
    border-radius: 50%;
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
