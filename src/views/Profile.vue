<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { fetchUserByUsername, type User } from '@/api/user'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { fetchPostsForUser, getPosts } from '@/store/posts'
  import { setTitle } from '@/title'

  const route = useRoute()
  const user = ref<User | undefined>()

  async function fetchUserData() {
    const username = route.params.username

    if (username && typeof username === 'string') {
      user.value = await fetchUserByUsername(username)
      await fetchPostsForUser(username)
    }
  }

  watch(
    () => route.params.username,
    (username) => {
      if (username && typeof username === 'string') {
        fetchUserData()
        setTitle(username, true)
      }
    },
    { immediate: true },
  )

  const posts = computed(() => {
    return user.value?.id ? getPosts(user.value.id) : []
  })
</script>

<template>
  <Spinner v-if="!user" />
  <DefaultLayout v-else from-top :title="user.username">
    <div class="profile">
      <div
        :style="{
          backgroundImage: posts[0] && `url(${posts[0].imageUrl})`,
        }"
        class="profile__header"
      />
      <div class="profile__user">
        <ProfilePhoto :user="user" class="profile__photo" size="large" />
      </div>
      <ul class="profile__posts">
        <li v-for="post in posts" :key="post.id">
          <PostImage
            :image-url="post.imageUrl"
            :to="{ name: 'post', params: { postId: post.id } }"
            rounded
            thumbnail
          />
        </li>
      </ul>
    </div>
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
  }

  .profile__header::before {
    background-image: linear-gradient(
      to bottom,
      rgba(var(--color-background-rgb), 0.75),
      var(--color-background)
    );
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
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
    margin: 0 auto;
    margin-top: 2rem;
    list-style: none;
  }

  @media (min-width: 640px) {
    .profile__user {
      margin-top: -8rem;
    }

    .profile__posts {
      gap: 1rem;
      grid-template-columns: repeat(4, 1fr);
      max-width: var(--content-width-lg);
      padding: 2rem;
    }
  }
</style>
