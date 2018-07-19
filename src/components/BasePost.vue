<template>
  <article class="post">
    <header class="post__header">
      <router-link
        :to="{ name: 'profile', params: { username } }"
        class="post__user"
      >
        <div class="post__profile">
          <ProfilePhoto :gravatar="gravatar" />
        </div>
        <div class="post__username">
          {{ username }}
        </div>
      </router-link>
      <div class="post__created-date">
        {{ createdDate }}
      </div>
    </header>
    <PostImage
      :caption="caption"
      :image-url="imageUrl"
      class="post__image"
    />
  </article>
</template>

<script>
import PostImage from "./PostImage";
import ProfilePhoto from "./ProfilePhoto";

export default {
  components: {
    PostImage,
    ProfilePhoto
  },
  props: {
    caption: {
      default: "",
      type: String
    },
    createdAt: {
      required: true,
      type: Date
    },
    gravatar: {
      required: true,
      type: String
    },
    imageUrl: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    }
  },
  computed: {
    createdDate() {
      return this.createdAt.toLocaleDateString();
    }
  }
};
</script>

<style lang="scss" scoped>
.post {
  &__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  &__user {
    align-items: center;
    color: inherit;
    display: flex;
    font-weight: bold;
    text-decoration: none;
  }

  &__profile {
    margin-right: 0.5rem;
  }

  &__created-date {
    color: $color-purple-light;
  }

  &__image {
    margin-top: 0.5rem;
  }
}
</style>
