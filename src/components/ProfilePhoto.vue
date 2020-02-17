<template>
  <RouterLink
    v-if="asLink"
    :to="{ name: 'profile', params: { username: username } }"
  >
    <img :alt="username" :class="classes" :src="profileUrl" />
  </RouterLink>
  <img v-else :alt="username" :class="classes" :src="profileUrl" />
</template>

<script lang="ts">
  import { computed, createComponent } from "@vue/composition-api";

  export default createComponent({
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
    setup({ size, user }) {
      const classes = computed(() => [
        "profile-photo",
        `profile-photo--${size}`
      ]);
      const username = computed(() => (user ? user.username : ""));
      const profileUrl = computed(() =>
        user && user.gravatar
          ? `https://www.gravatar.com/avatar/${user.gravatar}?d=identicon&s=128`
          : undefined
      );

      return { classes, username, profileUrl };
    }
  });
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
