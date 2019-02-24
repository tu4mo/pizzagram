<template>
  <article class="post">
    <lazy-component @show="onLazyLoad">
      <PostHeader :created-at="post.createdAt" :user="user" />
      <div class="post__image">
        <PostImage
          :caption="post.caption"
          :image-url="post.imageUrl"
          :to="imageTo"
        />
        <transition name="fade">
          <div v-if="isSharing" class="post__share">
            <div ref="postPath" class="post__path">{{ postPath }}</div>
          </div>
        </transition>
      </div>
      <footer class="post__footer">
        <div class="post__info">
          <div v-if="Array.isArray(post.likes)" class="post__likes">
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
          <BaseButton
            :class="[
              'post__share-button',
              { 'post__share-button--active': isSharing }
            ]"
            @click="onShareClick"
          >
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
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput,
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
      isSharing: false,
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
    onShareClick() {
      if (this.isSharing) {
        this.isSharing = false;
      } else {
        this.isSharing = true;
        this.$nextTick(() => {
          const { postPath } = this.$refs;

          if (document.selection) {
            const range = document.body.createTextRange();
            range.moveToElementText(postPath);
            range.select();
          } else if (window.getSelection) {
            const range = document.createRange();
            range.selectNode(postPath);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.post {
  &__link {
    border-radius: 1rem;

    &:active {
      background-color: #000;
    }
  }

  &__image {
    margin-top: 1rem;
    position: relative;
  }

  &__footer {
    align-items: flex-start;
    display: flex;
    margin-top: 1rem;
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
    color: var(--color-purple);

    &--active {
      color: var(--color-pink);
    }
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

  &__share {
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    bottom: 0;
    display: flex;
    left: 0;
    padding: 1rem;
    position: absolute;
    right: 0;
    top: 0;
  }

  &__path {
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem;
    text-align: center;
    user-select: text;
    word-wrap: break-word;
    width: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
