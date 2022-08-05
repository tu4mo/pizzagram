<template>
  <article v-if="!isPlaceholder" class="post">
    <div class="post__header">
      <PostHeader :created-at="post.createdAt" :user="user" />
    </div>
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
      <div v-if="authStore.isAuthenticated" class="post__buttons">
        <BaseButton v-if="isRemovable" @click="onRemoveClick">
          <BaseIcon name="trash2" />
        </BaseButton>
        <BaseButton secondary @click="onShareClick">
          <BaseIcon name="share" />
        </BaseButton>
        <BaseButton :secondary="!hasLiked" @click="onLikeClick">
          <BaseIcon :fill="hasLiked" name="heart" />
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

<script setup lang="ts">
  import { computed, getCurrentInstance, ref } from 'vue'

  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'
  import PostHeader from './PostHeader.vue'
  import PostImage from './PostImage.vue'
  import { authStore } from '@/store/auth'
  import { fetchUser, User } from '@/api/user'

  const props = defineProps({
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
  })

  const emit = defineEmits(['remove-click'])

  const instance = getCurrentInstance()

  const isPlaceholder = ref(true)

  const postPath = computed(
    () => `${window.location.origin}/post/${props.post.id}`
  )

  const user = ref<User | undefined>(undefined)

  const onVisibilityChanged = async (isVisible: boolean) => {
    if (!isVisible) {
      return
    }

    isPlaceholder.value = false
    user.value = await fetchUser(props.post.userId)
  }

  const onLikeClick = () => {
    instance?.proxy.$store.dispatch('toggleLike', props.post.id)
  }

  const onRemoveClick = () => {
    if (confirm('Are you sure you want to remove this post?')) {
      emit('remove-click')
    }
  }

  const onShareClick = async () => {
    if (!navigator.share) {
      alert("Sorry, you're browser doesn't seem to support Web Share.")
    }

    try {
      await navigator.share({
        title: 'Pizzagram',
        text: `${props.post.caption}${
          props.post.caption && props.post.location ? ' - ' : ''
        }${props.post.location}`,
        url: postPath as any,
      })
    } catch (e) {
      //
    }
  }

  const hasLiked = computed(
    () => props.post.likes && props.post.likes.includes(authStore.userId)
  )
</script>

<style lang="scss" scoped>
  .post {
    box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
    display: grid;

    @media (min-width: 640px) {
      border-radius: 2rem;
    }

    &__header {
      padding: 1rem;

      @media (min-width: 640px) {
        padding: 2rem;
      }
    }

    &__footer {
      align-items: flex-start;
      display: flex;
      gap: 1.5rem;
      padding: 1rem;

      @media (min-width: 640px) {
        padding: 2rem;
      }
    }

    &__info {
      flex: 1 1 auto;
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
      gap: 1.5rem;
      flex: 0 0 auto;
    }
  }
</style>
