<template>
  <article class="post">
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
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  import BaseButton from './BaseButton.vue'
  import BaseIcon from './BaseIcon.vue'
  import PostHeader from './PostHeader.vue'
  import PostImage from './PostImage.vue'
  import { authStore } from '@/store/auth'
  import type { User } from '@/api/user'
  import { fetchUser } from '@/api/user'
  import { toggleLike } from '@/store/posts'
  import type { Post } from '@/api/posts'
  import type { RouterLinkProps } from 'vue-router'

  type Props = {
    imageTo?: RouterLinkProps['to']
    isRemovable?: boolean
    post: Post
  }

  const props = withDefaults(defineProps<Props>(), {
    imageTo: undefined,
    isRemovable: false,
  })

  const emit = defineEmits<{ (event: 'remove-click'): void }>()

  const user = ref<User | undefined>(undefined)
  watch(
    () => props.post,
    async () => {
      user.value = await fetchUser(props.post.userId)
    },
    { immediate: true },
  )

  const onLikeClick = async () => {
    await toggleLike(props.post.id)
  }

  const onRemoveClick = () => {
    if (confirm('Are you sure you want to remove this post?')) {
      emit('remove-click')
    }
  }

  const onShareClick = async () => {
    if (!navigator.share) {
      alert("Sorry, your browser doesn't seem to support Web Share.")
    }

    try {
      await navigator.share({
        title: 'Pizzagram',
        text: props.post.caption,
        url: `${window.location.origin}/post/${props.post.id}`,
      })
    } catch (e) {
      //
    }
  }

  const hasLiked = computed(() => props.post.likes?.includes(authStore.userId))
</script>

<style scoped>
  .post {
    box-shadow: var(--shadow-lg);
    display: grid;
  }

  .post__header {
    padding: 1rem;
  }

  .post__footer {
    align-items: flex-start;
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
  }

  .post__info {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.25rem;
  }

  .post__likes {
    font-weight: bold;
  }

  .post__caption {
    color: var(--color-gray);
  }

  .post__buttons {
    display: grid;
    grid-auto-flow: column;
    gap: 1.5rem;
    flex: 0 0 auto;
  }

  @media (min-width: 640px) {
    .post {
      border-radius: 2rem;
    }

    .post__header {
      padding: 2rem;
    }

    .post__footer {
      padding: 2rem;
    }
  }
</style>
