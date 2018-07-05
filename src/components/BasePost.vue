<template>
  <article class="post">
    <header class="post__header">
      <div class="post__user">
        <img
          :src="profileUrl"
          class="post__profile"
        >
        <div class="post__username">
          {{ username }}
        </div>
      </div>
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

export default {
  components: {
    PostImage
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
    imageUrl: {
      required: true,
      type: String
    },
    profileUrl: {
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
    display: flex;
    font-weight: bold;
  }

  &__profile {
    border-radius: 1rem;
    height: 2rem;
    margin-right: 0.5rem;
    width: 2rem;
  }

  &__created-date {
    color: $color-purple-light;
  }

  &__image {
    margin-top: 0.5rem;
  }
}
</style>
