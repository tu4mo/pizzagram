<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { fetchUserByUsername, type User } from '@/api/user'
  import Dialog from '@/components/Dialog.vue'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { feedsStore, subscribeToFeed } from '@/store/feeds'
  import { setTitle } from '@/title'

  const route = useRoute()
  const router = useRouter()
  const user = ref<User | undefined>()

  async function fetchFeed() {
    const username = route.params.username

    if (typeof username === 'string') {
      user.value = await fetchUserByUsername(username)

      if (user.value) {
        subscribeToFeed(user.value.id)
      }
    }
  }

  watch(
    () => route.params.username,
    async (username) => {
      if (typeof username === 'string') {
        setTitle(username, true)
        await fetchFeed()
      }
    },
    { immediate: true },
  )

  const feed = computed(() =>
    user.value?.id ? (feedsStore[user.value.id] ?? []) : [],
  )

  async function onClose() {
    await router.replace({
      name: 'profile',
      params: { username: user.value?.username },
    })
  }
</script>

<template>
  <Spinner v-if="!user" />
  <DefaultLayout v-else from-top :title="user.username">
    <div class="profile">
      <div
        :style="{
          backgroundImage: `url(${feed.at(0)?.imageUrl ?? ''})`,
        }"
        class="profile__header"
      />
      <div class="profile__user">
        <ProfilePhoto :user="user" class="profile__photo" size="large" />
      </div>
      <ul class="profile__posts">
        <li v-for="post in feed" :key="post.id">
          <PostImage
            :alt="post.caption"
            :image-url="post.imageUrl"
            :to="{
              name: 'post',
              params: { username: user.username, postId: post.id },
              replace: true,
            }"
            rounded
            thumbnail
          />
        </li>
      </ul>
    </div>
    <Dialog :is-open="!!route.params.postId" @close="onClose">
      <RouterView />
    </Dialog>
  </DefaultLayout>
</template>

<style scoped>
  .profile__header {
    aspect-ratio: 16 / 9;
    background-attachment: fixed;
    background-position: 50% 50%;
    background-size: cover;
    max-height: 16rem;
    position: relative;
    width: 100%;

    &::before {
      background-image: linear-gradient(
        to bottom,
        rgba(var(--color-background-rgb) / 0.75),
        var(--color-background)
      );
      content: '';
      inset: 0;
      position: absolute;
    }
  }

  .profile__user {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: -4rem;
    padding: 0 2rem;
    position: relative;
  }

  .profile__photo {
    box-shadow: 0 0 4rem 2rem #fff;
    margin-bottom: 0.5rem;
  }

  .profile__posts {
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(3, 1fr);
    list-style: none;
    margin: 0 auto;
    margin-top: 2rem;
  }

  @media (min-width: 640px) {
    .profile__user {
      margin-top: -8rem;
    }

    .profile__posts {
      gap: 1rem;
      max-width: var(--content-width-lg);
      padding: 2rem;
    }
  }
</style>
