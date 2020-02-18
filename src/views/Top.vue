<template>
  <DefaultLayout title="Top 10">
    <ul class="top">
      <li
        v-for="(user, index) in $store.getters.getTopPosters"
        :key="user"
        class="top__row"
      >
        <BaseLink
          :to="{
            name: 'profile',
            params: { username: getUser(user).username }
          }"
          class="top__item"
        >
          <ProfilePhoto :user="getUser(user)" />
          <div class="top__user">
            <div class="top__username">{{ getUser(user).username }}</div>
            <div class="top__posts">
              {{ getUser(user).posts }}
              {{ getUser(user).posts === 1 ? 'post' : 'posts' }}
            </div>
          </div>
        </BaseLink>
        <div class="top__rank">{{ index + 1 }}.</div>
      </li>
    </ul>
  </DefaultLayout>
</template>

<script>
  import DefaultLayout from '@/layouts/Default'

  import BaseLink from '@/components/BaseLink'
  import ProfilePhoto from '@/components/ProfilePhoto'

  export default {
    components: {
      BaseLink,
      DefaultLayout,
      ProfilePhoto
    },
    created() {
      this.getTopPosters()
    },
    methods: {
      getTopPosters() {
        this.$store.dispatch('getTopPosters')
      },
      getUser(username) {
        return this.$store.getters.getUser(username)
      }
    },
    metaInfo: {
      title: 'Top 10'
    }
  }
</script>

<style lang="scss" scoped>
  .top {
    list-style-type: none;
    padding: 2rem;
    position: relative;

    &__row {
      align-items: center;
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 2rem;
      }
    }

    &__item {
      align-items: center;
      color: var(--color-secondary);
      display: flex;
    }

    &__rank {
      background-color: var(--color-primary);
      border-radius: 0.25rem;
      color: #fff;
      font-weight: bold;
      margin-left: 1rem;
      padding: 0.5rem 0;
      text-align: center;
      width: 2rem;
    }

    &__user {
      margin-left: 1rem;
    }

    &__username {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    &__posts {
      color: var(--color-gray);
    }
  }
</style>
