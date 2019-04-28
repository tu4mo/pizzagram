<template>
  <DefaultLayout>
    <div class="profile">
      <div
        :style="{
          backgroundImage: posts[0] && `url(${posts[0].imageUrl})`
        }"
        class="profile__header"
      />
      <div class="profile__user">
        <ProfilePhoto
          v-if="user && user.username"
          :alt="user.username"
          :gravatar="user.gravatar"
          class="profile__photo"
          size="large"
        />
        <div class="profile__username">{{ user.username }}</div>
      </div>
      <div class="profile__posts">
        <PostImage
          v-for="post in $store.getters.getPostsByFeed(user.username)"
          :image-url="post.imageUrl.replace('.jpg', '_128.jpg')"
          :key="post.id"
          :to="{ name: 'post', params: { postId: post.id } }"
        />
      </div>
      <div v-if="$store.getters.getIsMe(user.id)" class="profile__footer">
        <BaseButton @click="onLogOutClick">Log Out</BaseButton>
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";
import PostImage from "@/components/PostImage";
import ProfilePhoto from "@/components/ProfilePhoto";

import Firebase from "@/firebase";

export default {
  components: {
    BaseButton,
    DefaultLayout,
    PostImage,
    ProfilePhoto
  },
  computed: {
    posts() {
      return this.$store.getters.getPostsByFeed(this.user.username);
    },
    user() {
      return this.$store.getters.getUser(this.$route.params.username);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { username } = vm.$route.params;
      vm.fetchData(username);
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.username !== from.params.username) {
      this.fetchData(to.params.username);
    }
    next();
  },
  methods: {
    async fetchData(username) {
      await this.$store.dispatch("getUser", username);
      await this.$store.dispatch("getPostsByUser", username);
    },
    async onLogOutClick() {
      await Firebase.signOut();
      this.$router.push({ name: "login" });
    }
  },
  metaInfo() {
    return {
      title: this.user.username
    };
  }
};
</script>

<style lang="scss" scoped>
.profile {
  &__header {
    background-size: cover;
    background-position: 50% 50%;
    position: relative;
    max-height: 16rem;

    &::after {
      content: "";
      display: block;
      padding-top: 50%;
    }

    &::before {
      background-image: linear-gradient(
        to bottom,
        rgba(255, 232, 221, 0.8),
        rgb(255, 232, 221)
      );
      bottom: 0;
      content: "";
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
    border: 0.25rem solid #fff;
    margin-bottom: 0.5rem;
  }

  &__username {
    font-weight: bold;
  }

  &__posts {
    display: grid;
    grid-gap: 1px;
    grid-template-columns: repeat(3, 1fr);
    margin: 0 auto;
    padding: 2rem 0;

    @media (min-width: 640px) {
      grid-gap: 1rem;
      grid-template-columns: repeat(5, 1fr);
      max-width: var(--content-width-lg);
      padding: 2rem;
    }
  }

  &__footer {
    margin-top: 1rem;
  }
}
</style>
