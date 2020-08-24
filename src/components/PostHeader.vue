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
        <ProfilePhoto :user="user" />
      </div>
      <div class="post-header__username">{{ user ? user.username : null }}</div>
    </component>
    <div class="post-header__created-date">{{ createdDate }}</div>
  </header>
</template>

<script lang="ts">
  import { computed, defineComponent } from '@vue/composition-api'

  import ProfilePhoto from './ProfilePhoto.vue'

  export default defineComponent({
    components: {
      ProfilePhoto,
    },
    props: {
      createdAt: {
        required: true,
        type: Date,
      },
      user: {
        default: () => {},
        type: Object,
      },
    },
    setup(props) {
      // @ts-ignore
      const createdDate = computed(() => props.createdAt.toLocaleDateString())
      const isUserLoaded = computed(
        () => props.user && Object.keys(props.user).length > 0
      )

      return {
        createdDate,
        isUserLoaded,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .post-header {
    align-items: center;
    display: flex;
    justify-content: space-between;

    &__user {
      align-items: center;
      color: var(--color-secondary);
      display: flex;
      font-weight: bold;
      text-decoration: none;
    }

    &__profile {
      margin-right: 0.5rem;

      @media (min-width: 640px) {
        margin-right: 1rem;
      }
    }

    &__created-date {
      color: var(--color-gray);
    }
  }
</style>
