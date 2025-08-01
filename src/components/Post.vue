<script setup lang="ts">
  import { ref, watch } from 'vue'

  import Button from './Button.vue'
  import Icon from './Icon.vue'
  import PostCaption from './PostCaption.vue'
  import PostComment from './PostComment.vue'
  import PostComments from './PostComments.vue'
  import PostHeader from './PostHeader.vue'
  import PostImage from './PostImage.vue'
  import PostLike from './PostLike.vue'

  import type { Post } from '@/api/posts'
  import { type User, fetchUser } from '@/api/user'
  import { authStore } from '@/store/auth'

  const {
    isElevated = false,
    isEditable = false,
    post,
  } = defineProps<{
    isElevated?: boolean
    isEditable?: boolean
    post: Post | undefined
  }>()

  const emit = defineEmits<{
    (event: 'caption-change', newCaption: string): void
    (event: 'remove-click'): void
  }>()

  const user = ref<User | undefined>(undefined)

  watch(
    () => post,
    async () => {
      if (post?.userId) {
        user.value = await fetchUser(post.userId)
      }
    },
    { immediate: true },
  )

  const showComments = ref(false)

  function onRemoveClick() {
    if (confirm('Are you sure you want to remove this post?')) {
      emit('remove-click')
    }
  }

  async function onShareClick() {
    if (!post) {
      return
    }

    try {
      await navigator.share({
        text: post.caption,
        title: 'Pizzagram',
        url: `${window.location.origin}/post/${post.id}`,
      })
    } catch {
      alert("Sorry, your browser doesn't seem to support Web Share.")
    }
  }
</script>

<template>
  <article :class="['post', { 'post--elevated': isElevated }]">
    <div class="post__header">
      <PostHeader :created-at="post?.createdAt" :user="user" />
    </div>
    <div class="post__image">
      <PostImage :alt="post?.caption" :image-url="post?.imageUrl" rounded />
      <PostCaption
        :caption="post?.caption"
        :is-editable="isEditable"
        @change="emit('caption-change', $event)"
      />
    </div>
    <footer class="post__footer">
      <div class="post__details">
        <div class="post__info">
          <div class="post__meta">
            <PostLike v-if="authStore.isAuthenticated" :post="post" />
            <PostComment
              v-if="authStore.isAuthenticated"
              :post="post"
              @click="showComments = !showComments"
            />
          </div>
        </div>
        <div v-if="authStore.isAuthenticated" class="post__actions">
          <Button v-if="isEditable" aria-label="Remove" @click="onRemoveClick">
            <Icon name="trash2" />
          </Button>
          <Button secondary aria-label="Share" @click="onShareClick">
            <Icon name="share" />
          </Button>
        </div>
      </div>
      <PostComments v-if="showComments && post" :post-id="post.id" />
    </footer>
  </article>
</template>

<style scoped>
  .post {
    background-color: var(--color-background);
    display: grid;
  }

  .post--elevated {
    box-shadow: var(--shadow-lg);
  }

  .post__header {
    padding: 1rem;
  }

  .post__image {
    position: relative;
  }

  .post__footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .post__details {
    align-items: flex-start;
    display: flex;
    gap: 1.5rem;
  }

  .post__info {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.5rem;
  }

  .post__meta {
    display: flex;
    font-weight: bold;
    gap: 1.5rem;
  }

  .post__meta > * {
    flex: 0;
  }

  .post__actions {
    display: grid;
    flex: 0 0 auto;
    gap: 1.5rem;
    grid-auto-flow: column;
  }

  @media (min-width: 640px) {
    .post {
      border-radius: var(--radius-lg);
    }

    .post__header {
      padding: 2rem;
    }

    .post__image {
      margin: 0 2rem;
    }

    .post__footer {
      gap: 2rem;
      padding: 2rem;
    }
  }
</style>
