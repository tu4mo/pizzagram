<template>
  <DefaultLayout>
    <BaseSpinner v-if="isLoading" />
    <template v-else>
      <div class="profile">
        <div class="profile__header">
          <div class="profile__photo">
            <ProfilePhoto
              :gravatar="user.gravatar"
              size="medium"
            />
          </div>
          <div class="profile__username">
            {{ user.username }}
          </div>
        </div>
        <div class="profile__posts">
          <div
            v-for="(post, index) in $store.getters.getPosts(user.username)"
            :key="index"
            class="profile__post"
          >
            <PostImage :image-url="post.imageUrl" />
          </div>
        </div>
        <div class="profile__footer">
          <BaseButton @click="onLogOutClick">Log Out</BaseButton>
        </div>
      </div>
    </template>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";
import BaseSpinner from "@/components/BaseSpinner";
import PostImage from "@/components/PostImage";
import ProfilePhoto from "@/components/ProfilePhoto";

import { signOut } from "@/firebase";

export default {
  components: {
    BaseButton,
    BaseSpinner,
    DefaultLayout,
    PostImage,
    ProfilePhoto
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser(this.$route.params.username);
    }
  },
  created() {
    const { username } = this.$route.params;
    this.fetchData(username);
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
      await signOut();
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

  &__posts {
    display: flex;
    flex-wrap: wrap;
    margin: -0.25rem;
  }

  &__post {
    padding: 0.25rem;
    width: 33.33%;
  }

  &__footer {
    margin-top: 1rem;
  }
}
</style>
