<template>
  <article class="post">
    <div class="post__header">
      <PostHeader :created-at="post.createdAt" :user="user" />
    </div>
    <div class="post__image">
      <PostImage
        :alt="post.caption"
        :image-url="post.imageUrl"
        :to="imageTo"
        rounded
      />
    </div>
    <footer class="post__footer">
      <div class="post__details">
        <div class="post__info">
          <div class="post__meta">
            <div v-if="likes > 0">
              {{ likes }} like{{ likes !== 1 ? 's' : '' }}
            </div>
            <div v-if="isDevelopment && post.commentsCount > 0">
              {{ post.commentsCount }} comment{{
                post.commentsCount !== 1 ? 's' : ''
              }}
            </div>
          </div>
          <div v-if="post.caption" class="post__caption">
            {{ post.caption }}
          </div>
        </div>
        <div v-if="authStore.isAuthenticated" class="post__actions">
          <Button v-if="isRemovable" aria-label="Remove" @click="onRemoveClick">
            <Icon name="trash2" />
          </Button>
          <Button secondary aria-label="Share" @click="onShareClick">
            <Icon name="share" />
          </Button>
          <PostLike :post="post" />
        </div>
      </div>
      <PostComments v-if="isDevelopment" :post-id="post.id" />
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import type { RouterLinkProps } from 'vue-router'

  import Button from './Button.vue'
  import Icon from './Icon.vue'
  import PostComments from './PostComments.vue'
  import PostHeader from './PostHeader.vue'
  import PostImage from './PostImage.vue'
  import PostLike from './PostLike.vue'

  import type { Post } from '@/api/posts'
  import type { User } from '@/api/user'
  import { fetchUser } from '@/api/user'
  import { authStore } from '@/store/auth'

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

  const likes = computed(() =>
    props.post.likes ? Object.keys(props.post.likes).length : 0,
  )

  const user = ref<User | undefined>(undefined)
  watch(
    () => props.post,
    async () => {
      user.value = await fetchUser(props.post.userId)
    },
    { immediate: true },
  )

  function onRemoveClick() {
    if (confirm('Are you sure you want to remove this post?')) {
      emit('remove-click')
    }
  }

  async function onShareClick() {
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

  const isDevelopment = process.env.NODE_ENV === 'development'
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
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
    gap: 0.25rem;
  }

  .post__meta {
    display: flex;
    font-weight: bold;
    gap: 1rem;
  }

  .post__caption {
    color: var(--color-gray);
  }

  .post__actions {
    display: grid;
    grid-auto-flow: column;
    gap: 1.5rem;
    flex: 0 0 auto;
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
      padding: 2rem;
    }
  }
</style>
