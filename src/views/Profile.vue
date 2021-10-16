<template>
  <DefaultLayout from-top>
    <div class="profile">
      <div
        :style="{
          backgroundImage: posts[0] && `url(${posts[0].imageUrl})`,
        }"
        class="profile__header"
      />
      <div class="profile__user">
        <ProfilePhoto :user="user" class="profile__photo" size="large" />
        <div class="profile__username">{{ user.username }}</div>
      </div>
      <ul class="profile__posts">
        <li
          v-for="post in $store.getters.getPostsByFeed(user.username)"
          :key="post.id"
        >
          <PostImage
            :image-url="post.imageUrl"
            :to="{ name: 'post', params: { postId: post.id } }"
            rounded
            thumbnail
          />
        </li>
      </ul>
      <div v-if="$store.getters.getIsMe(user.id)" class="profile__footer">
        <BaseButton @click="onLogOutClick">Log Out</BaseButton>
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
  import DefaultLayout from '@/layouts/Default.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import PostImage from '@/components/PostImage.vue'
  import ProfilePhoto from '@/components/ProfilePhoto.vue'

  import { signOut } from '@/api'

  export default {
    components: {
      BaseButton,
      DefaultLayout,
      PostImage,
      ProfilePhoto,
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        const { username } = vm.$route.params
        vm.fetchData(username)
      })
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params.username !== from.params.username) {
        this.fetchData(to.params.username)
      }
      next()
    },
    computed: {
      posts() {
        return this.$store.getters.getPostsByFeed(this.user.username)
      },
      user() {
        return this.$store.getters.getUser(this.$route.params.username)
      },
    },
    methods: {
      async fetchData(username) {
        await this.$store.dispatch('getUser', username)
        await this.$store.dispatch('getPostsByUser', username)
      },
      async onLogOutClick() {
        await signOut()
        this.$router.push({ name: 'login' })
      },
    },
    metaInfo() {
      return {
        title: this.user.username,
      }
    },
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

    &__username {
      font-weight: bold;
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
