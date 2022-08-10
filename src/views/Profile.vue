<template>
  <BaseSpinner v-if="!user" />
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
      <div v-if="isMe" class="profile__footer">
        <BaseButton @click="onLogOutClick">Log Out</BaseButton>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { computed, getCurrentInstance, ref, watch } from 'vue'

  import DefaultLayout from '@/layouts/Default.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'

  import { getIsMe } from '@/store/auth'
  import { fetchUserByUsername, User } from '@/api/user'
  import { setTitle } from '@/title'
  import { signOut } from '@/api/auth'
  import { fetchPostsForUser, getPostsByFeed } from '@/store/posts'

  const instance = getCurrentInstance()
  const user = ref<User | undefined>(undefined)

  const fetchUserData = async () => {
    const username = instance?.proxy.$route.params.username

    if (username) {
      user.value = await fetchUserByUsername(username)
      await fetchPostsForUser(username)
    }
  }

  watch(
    () => instance?.proxy.$route.params.username,
    (username) => {
      if (username) {
        fetchUserData()
        setTitle(username, true)
      }
    },
    { immediate: true }
  )

  const posts = computed(() => getPostsByFeed(user.value?.username))
  const isMe = computed(() => getIsMe(user.value?.id))

  const onLogOutClick = async () => {
    await signOut()
    instance?.proxy.$router.push({ name: 'login' })
  }
</script>

<style lang="scss" scoped>
  .profile {
    &__header {
      background-attachment: fixed;
      background-position: 50% 50%;
      background-size: cover;
      max-height: 16rem;
      position: relative;

      &::after {
        content: '';
        display: block;
        padding-top: 50%;
        pointer-events: none;
      }

      &::before {
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
    }

    &__user {
      align-items: center;
      display: flex;
      flex-direction: column;
      margin-top: -4rem;
      padding: 0 2rem;
      position: relative;

      @media (min-width: 640px) {
        margin-top: -8rem;
      }
    }

    &__photo {
      box-shadow: 0 0 4rem 2rem #fff;
      margin-bottom: 0.5rem;
    }

    &__posts {
      display: grid;
      gap: 1px;
      grid-template-columns: repeat(3, 1fr);
      margin: 0 auto;
      margin-top: 2rem;
      list-style: none;

      @media (min-width: 640px) {
        gap: 1rem;
        grid-template-columns: repeat(4, 1fr);
        max-width: var(--content-width-lg);
        padding: 2rem;
      }
    }

    &__footer {
      margin: 1rem 0;
    }
  }
</style>
