<template>
  <DefaultLayout>
    <div class="profile">
      <div class="profile__header">
        <div class="profile__photo">
          <ProfilePhoto :gravatar="user.gravatar" size="medium" />
        </div>
        <div class="profile__username">{{ user.username }}</div>
      </div>
      <div class="profile__posts">
        <router-link
          v-for="post in $store.getters.getPostsByFeed(user.username)"
          :key="post.id"
          :to="{ name: 'post', params: { postId: post.id } }"
          class="profile__post"
        >
          <PostImage :image-url="post.imageUrl.replace('.jpg', '_128.jpg')" />
        </router-link>
      </div>
      <div v-if="$store.getters.getIsMe(user.username)" class="profile__footer">
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
  }
};
</script>

<style lang="scss" scoped>
.profile {
  padding: 2rem;

  &__header {
    align-items: center;
    display: flex;
    margin-bottom: 1rem;
  }

  &__photo {
    margin-right: 1rem;
  }

  &__username {
    font-weight: bold;
  }

  &__posts {
    display: flex;
    flex-wrap: wrap;
    margin: -0.25rem;

    @media (min-width: 640px) {
      margin: -0.5rem;
    }
  }

  &__post {
    padding: 0.25rem;
    width: 33.33%;

    @media (min-width: 640px) {
      padding: 0.5rem;
    }
  }

  &__footer {
    margin-top: 1rem;
  }
}
</style>
