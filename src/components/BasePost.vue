<template>
  <article class="post">
    <header class="post__header">
      <router-link
        :to="{ name: 'profile', params: { username: post.user.username } }"
        class="post__user"
      >
        <div class="post__profile">
          <ProfilePhoto :gravatar="post.user.gravatar" />
        </div>
        <div class="post__username">
          {{ post.user.username }}
        </div>
      </router-link>
      <div class="post__created-date">
        {{ createdDate }}
      </div>
    </header>
    <PostImage
      :caption="post.caption"
      :image-url="post.imageUrl"
      class="post__image"
    />
    <footer class="post__footer">
      <div class="post__caption">
        {{ post.caption }}
      </div>
      <div class="post__like">
        <BaseButton
          :class="['post__like-button', { 'post__like-button--liked': post.liked }]"
          @click="onLikeClick"
        >
          <BaseIcon name="heart" />
        </BaseButton>
      </div>
    </footer>
  </article>
</template>

<script>
import BaseButton from "./BaseButton";
import BaseIcon from "./BaseIcon";
import PostImage from "./PostImage";
import ProfilePhoto from "./ProfilePhoto";

export default {
  components: {
    BaseButton,
    BaseIcon,
    PostImage,
    ProfilePhoto
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    createdDate() {
      return this.post.createdAt.toLocaleDateString();
    }
  },
  methods: {
    onLikeClick() {
      this.$store.dispatch("toggleLike", this.post.id);
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
    color: var(--color-purple);
    display: flex;
    font-weight: bold;
    text-decoration: none;
  }

  &__profile {
    margin-right: 0.5rem;
  }

  &__created-date {
    color: var(--color-gray);
  }

  &__image {
    margin-top: 0.5rem;
  }

  &__footer {
    align-items: flex-start;
    display: flex;
    margin-top: 0.5rem;
  }

  &__caption {
    color: var(--color-gray);
    flex: 1 1 auto;
    margin-right: 1rem;
  }

  &__like {
    flex: 0 0 auto;
  }

  &__like-button {
    color: var(--color-purple);

    &--liked {
      color: var(--color-pink);

      & /deep/ svg {
        fill: var(--color-pink);
      }
    }
  }
}
</style>
