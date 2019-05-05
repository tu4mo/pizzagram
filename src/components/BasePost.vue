<template>
  <article class="post">
    <lazy-component @show="onLazyLoad">
      <PostHeader :created-at="post.createdAt" :user="user" />
      <BaseSpacer mt1>
        <PostImage :image-url="post.imageUrl" :to="imageTo" />
      </BaseSpacer>
      <footer class="post__footer">
        <div class="post__info">
          <div
            v-if="Array.isArray(post.likes) && post.likes.length > 0"
            class="post__likes"
          >
            {{ post.likes.length }} like{{ post.likes.length !== 1 ? "s" : "" }}
          </div>
          <div v-if="post.caption" class="post__caption">
            {{ post.caption }}
          </div>
          <div v-if="post.location" class="post__location">
            {{ post.location }}
          </div>
        </div>
        <div v-if="$store.state.auth.isAuthenticated" class="post__buttons">
          <BaseButton v-if="isRemovable" @click="onRemoveClick">
            <BaseIcon name="trash2" />
          </BaseButton>
          <BaseButton class="post__share-button" @click="onShareClick">
            <BaseIcon name="share" />
          </BaseButton>
          <BaseButton
            :class="[
              'post__like-button',
              {
                'post__like-button--liked': $store.getters.getHasLiked(post.id)
              }
            ]"
            @click="onLikeClick"
          >
            <BaseIcon name="heart" />
          </BaseButton>
        </div>
      </footer>
    </lazy-component>
    <template v-if="isPlaceholder">
      <PostHeader :created-at="post.createdAt" />
      <div class="post__image"><PostImage /></div>
    </template>
  </article>
</template>

<script>
import BaseButton from "./BaseButton";
import BaseIcon from "./BaseIcon";
import BaseInput from "./BaseInput";
import BaseSpacer from "./BaseSpacer";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput,
    BaseSpacer,
    PostHeader,
    PostImage
  },
  props: {
    imageTo: {
      default: null,
      type: Object
    },
    isRemovable: {
      default: false,
      type: Boolean
    },
    post: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isPlaceholder: true
    };
  },
  computed: {
    postPath() {
      return `${window.location.origin}/post/${this.post.id}`;
    },
    user() {
      return this.$store.getters.getUserById(this.post.userId);
    }
  },
  methods: {
    onLazyLoad() {
      this.isPlaceholder = false;
      this.$store.dispatch("getUserById", this.post.userId);
      this.$store.dispatch("getLikes", { postId: this.post.id });
    },
    onLikeClick() {
      this.$store.dispatch("toggleLike", this.post.id);
    },
    onRemoveClick() {
      if (confirm("Are you sure you want to remove this post?")) {
        this.$emit("remove-click");
      }
    },
    async onShareClick() {
      if (navigator.share) {
        await navigator.share({
          title: "Pizzagram",
          text: `${this.post.caption}${
            this.post.caption && this.post.location ? " - " : ""
          }${this.post.location}`,
          url: this.postPath
        });
      } else {
        alert("Sorry, you're browser doesn't seem to support Web Share.");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.post {
  &__footer {
    align-items: flex-start;
    display: flex;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-right: 1rem;

    @media (min-width: 640px) {
      padding-left: 0;
      padding-right: 0;
    }
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

  &__location {
    color: var(--color-gray);
  }

  &__buttons {
    display: flex;
    flex: 0 0 auto;

    & > *:not(:last-child) {
      margin-right: 1rem;
    }
  }

  &__share-button {
    color: var(--color-secondary);

    &--active {
      color: var(--color-primary);
    }
  }

  &__like-button {
    color: var(--color-secondary);

    &--liked {
      color: var(--color-primary);

      & /deep/ svg {
        fill: var(--color-primary);
      }
    }
  }
}
</style>
