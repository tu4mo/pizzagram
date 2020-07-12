<template>
  <article v-if="!isPlaceholder" class="post">
    <PostHeader :created-at="post.createdAt" :user="user" />
    <PostImage :image-url="post.imageUrl" :to="imageTo" />
    <footer class="post__footer">
      <div class="post__info">
        <div
          v-if="Array.isArray(post.likes) && post.likes.length > 0"
          class="post__likes"
        >
          {{ post.likes.length }} like{{ post.likes.length !== 1 ? 's' : '' }}
        </div>
        <div v-if="post.caption" class="post__caption">
          {{ post.caption }}
        </div>
        <div v-if="post.location" class="post__location">
          <BaseIcon name="mapPin" size="sm" />
          <span class="post__location-text">{{ post.location }}</span>
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
              'post__like-button--liked': $store.getters.getHasLiked(post.id),
            },
          ]"
          @click="onLikeClick"
        >
          <BaseIcon name="heart" />
        </BaseButton>
      </div>
    </footer>
  </article>
  <article
    v-else
    v-observe-visibility="{
      callback: onVisibilityChanged,
      intersection: { rootMargin: '512px' },
      once: true,
    }"
  >
    <PostHeader :created-at="post.createdAt" />
    <div class="post__image"><PostImage /></div>
  </article>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from '@vue/composition-api'

  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'
  import PostHeader from './PostHeader.vue'
  import PostImage from './PostImage.vue'

  export default defineComponent({
    components: {
      BaseButton,
      BaseIcon,
      PostHeader,
      PostImage,
    },
    props: {
      imageTo: {
        default: null,
        type: Object,
      },
      isRemovable: {
        default: false,
        type: Boolean,
      },
      post: {
        required: true,
        type: Object,
      },
    },
    setup(props, context) {
      const isPlaceholder = ref(true)

      const postPath = computed(
        () => `${window.location.origin}/post/${props.post.id}`
      )

      const user = computed(() =>
        context.root.$store.getters.getUserById(props.post.userId)
      )

      const onVisibilityChanged = (isVisible: boolean) => {
        if (!isVisible) {
          return
        }

        isPlaceholder.value = false
        context.root.$store.dispatch('getUserById', props.post.userId)
        context.root.$store.dispatch('getLikes', { postId: props.post.id })
      }

      const onLikeClick = () => {
        context.root.$store.dispatch('toggleLike', props.post.id)
      }

      const onRemoveClick = () => {
        if (confirm('Are you sure you want to remove this post?')) {
          context.emit('remove-click')
        }
      }

      const onShareClick = async () => {
        // @ts-ignore
        if (navigator.share) {
          // @ts-ignore
          await navigator.share({
            title: 'Pizzagram',
            text: `${props.post.caption}${
              props.post.caption && props.post.location ? ' - ' : ''
            }${props.post.location}`,
            url: postPath as any,
          })
        } else {
          alert("Sorry, you're browser doesn't seem to support Web Share.")
        }
      }

      return {
        isPlaceholder,
        onVisibilityChanged,
        onLikeClick,
        onRemoveClick,
        onShareClick,
        postPath,
        user,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .post {
    display: grid;
    grid-gap: 1rem;

    &__footer {
      align-items: flex-start;
      display: flex;
      padding-left: 1rem;
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
      align-items: center;
      color: var(--color-gray);
      display: flex;
    }

    &__location-text {
      margin-left: 0.5rem;
    }

    &__buttons {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 1rem;
      flex: 0 0 auto;
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
