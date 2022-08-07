<template>
  <DefaultLayout title="Top 10">
    <ul class="top">
      <li v-for="(user, index) in topPosters" :key="user.id" class="top__row">
        <BaseLink
          :to="{
            name: 'profile',
            params: { username: user.username },
          }"
          class="top__item"
        >
          <ProfilePhoto :user="user" />
          <div class="top__user">
            <div class="top__username">{{ user.username }}</div>
            <div class="top__posts">
              {{ user.posts }}
              {{ user.posts === 1 ? 'post' : 'posts' }}
            </div>
          </div>
        </BaseLink>
        <div class="top__rank">{{ index + 1 }}.</div>
      </li>
    </ul>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import DefaultLayout from '@/layouts/Default.vue'

  import BaseLink from '@/components/BaseLink.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'
  import { setTitle } from '@/title'
  import { fetchTopPosters } from '@/api/top'
  import { User } from '@/api/user'

  setTitle('Top 10')

  const topPosters = ref<User[] | undefined>(undefined)

  onMounted(async () => {
    topPosters.value = await fetchTopPosters()
  })
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
