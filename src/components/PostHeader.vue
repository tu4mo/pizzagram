<template>
  <header class="post-header">
    <component
      :is="isUserLoaded ? 'RouterLink' : 'div'"
      :to="
        isUserLoaded
          ? { name: 'profile', params: { username: user.username } }
          : null
      "
      class="post-header__user"
    >
      <div class="post-header__profile">
        <ProfilePhoto :gravatar="user ? user.gravatar : null" />
      </div>
      <div class="post-header__username">{{ user ? user.username : null }}</div>
    </component>
    <div class="post-header__created-date">{{ createdDate }}</div>
  </header>
</template>

<script>
import ProfilePhoto from "./ProfilePhoto";

export default {
  components: {
    ProfilePhoto
  },
  props: {
    createdAt: {
      required: true,
      type: String
    },
    user: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    createdDate() {
      const date = new Date(this.createdAt);
      return date.toLocaleDateString();
    },
    isUserLoaded() {
      return this.user && Object.keys(this.user).length > 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.post-header {
  align-items: center;
  display: flex;
  justify-content: space-between;

  &__user {
    align-items: center;
    color: var(--color-purple);
    display: flex;
    font-weight: bold;
    text-decoration: none;
  }

  &__profile {
    margin-right: 0.5rem;
  }

  &__created-date {
    color: var(--color-gray);
  }
}
</style>
