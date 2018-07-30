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
    <template v-if="imageTo">
      <router-link :to="imageTo">
        <PostImage
          :caption="post.caption"
          :image-url="post.imageUrl"
          class="post__image"
        />
      </router-link>
    </template>
    <template v-else>
      <PostImage
        :caption="post.caption"
        :image-url="post.imageUrl"
        class="post__image"
      />
    </template>
    <footer class="post__footer">
      <div class="post__info">
        <div class="post__likes">
          {{ post.likes.length }} like{{ post.likes.length !== 1 ? 's' : '' }}
        </div>
        <div class="post__caption">
          {{ post.caption }}
        </div>
      </div>
      <div
        v-if="$store.state.auth.isAuthenticated"
        class="post__like"
      >
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
    imageTo: {
      default: null,
      type: Object
    },
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

  &__info {
    flex: 1 1 auto;
    margin-right: 1rem;
  }

  &__likes {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  &__caption {
    color: var(--color-gray);
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
