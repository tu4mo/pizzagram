<template>
  <DefaultLayout title="Top 10">
    <ul class="top">
      <li v-for="(user, index) in topPosters" :key="user.id" class="top__row">
        <Link
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
              {{ user.postsCount }}
              {{ user.postsCount === 1 ? 'post' : 'posts' }}
            </div>
          </div>
        </Link>
        <div class="top__rank">{{ index + 1 }}.</div>
      </li>
    </ul>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import { fetchTopPosters } from '@/api/top'
  import type { User } from '@/api/user'
  import Link from '@/components/Link.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { setTitle } from '@/title'

  setTitle('Top 10')

  const topPosters = ref<User[] | undefined>(undefined)

  onMounted(async () => {
    topPosters.value = await fetchTopPosters()
  })
</script>

<style scoped>
  .top {
    list-style-type: none;
    padding: 2rem;
    position: relative;
  }

  .top__row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .top__row:not(:last-child) {
    margin-bottom: 2rem;
  }

  .top__item {
    align-items: center;
    color: var(--color-secondary);
    display: flex;
  }

  .top__rank {
    background-color: var(--color-primary);
    border-radius: var(--radius-xs);
    color: #fff;
    font-weight: bold;
    margin-left: 1rem;
    padding: 0.5rem 0;
    text-align: center;
    width: 2rem;
  }

  .top__user {
    margin-left: 1rem;
  }

  .top__username {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .top__posts {
    color: var(--color-gray);
  }
</style>
