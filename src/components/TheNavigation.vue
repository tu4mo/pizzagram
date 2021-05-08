<template>
  <nav class="navigation">
    <div class="navigation__items">
      <template v-if="isAuthenticated">
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
      </template>
      <template v-else>
        <NavItem :to="{ name: 'login' }" class="navigation__item" icon="user">
          Log In
        </NavItem>
      </template>
    </div>
  </nav>
</template>

<script lang="ts">
  import { computed, defineComponent } from '@vue/composition-api'

  import NavItem from './NavItem.vue'
  import TheCamera from './TheCamera.vue'

  export default defineComponent({
    components: {
      NavItem,
      TheCamera,
    },
    setup(props, context) {
      const isAuthenticated = computed(
        () => context.root.$store.state.auth.isAuthenticated
      )

      const notifications = computed(() => {
        const unreadNotificationsCount =
          context.root.$store.getters.getUnreadNotificationsCount

        return unreadNotificationsCount > 0 ? unreadNotificationsCount : null
      })

      const isDevelopment = computed(
        () => process.env.NODE_ENV === 'development'
      )

      const username = computed(() => context.root.$store.state.auth.username)

      return {
        notifications,
        isAuthenticated,
        isDevelopment,
        username,
      }
    },
  })
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
      display: grid;
      grid-auto-flow: column;
      height: 3.5rem;
      justify-content: space-around;

      @media (min-width: 640px) {
        gap: 1.5rem;
      }
    }
  }
</style>
