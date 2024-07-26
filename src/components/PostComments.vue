<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import Button from './Button.vue'
  import Icon from './Icon.vue'
  import Input from './Input.vue'

  import type { Comment } from '@/api/comments'
  import { addComment, deleteComment, fetchComments } from '@/api/comments'
  import { authStore } from '@/store/auth'
  import { postsStore } from '@/store/posts'

  type Props = {
    postId: string
  }

  const { postId } = defineProps<Props>()
  const comments = ref<Comment[]>([])
  const newComment = ref('')
  const isLoading = ref(false)

  onMounted(async () => {
    comments.value = await fetchComments(postId)
  })

  function onRemoveComment(id: string) {
    if (confirm('Are you sure you want to remove this comment?')) {
      comments.value = comments.value.filter((comment) => comment.id !== id)
      deleteComment(id)
    }
  }

  async function submit() {
    isLoading.value = true

    try {
      const comment = await addComment({ comment: newComment.value, postId })

      comments.value.push(comment)
      postsStore.posts[postId].commentsCount++
      newComment.value = ''
    } catch (err: any) {
      console.error(err)
      alert('Something went wrong. Please, try again later.')
    }

    isLoading.value = false
  }
</script>

<template>
  <div class="comments">
    <ol class="comments__list">
      <li
        v-for="{ id, isMe, username, comment } in comments"
        :key="id"
        class="comments__item"
      >
        <div>
          <strong>{{ username }}</strong>
          &nbsp; {{ comment }}
        </div>
        <div v-if="isMe">
          <Button
            aria-label="Remove comment"
            icon
            secondary
            @click="onRemoveComment(id)"
          >
            <Icon name="x" />
          </Button>
        </div>
      </li>
    </ol>
    <form v-if="authStore.isAuthenticated" @submit.prevent="submit">
      <Input
        v-model.trim="newComment"
        :disabled="isLoading"
        placeholder="Add a comment…"
        maxlength="500"
      />
    </form>
  </div>
</template>

<style scoped>
  .comments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .comments__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;

    &:empty {
      display: none;
    }
  }

  .comments__item {
    display: flex;
    justify-content: space-between;
  }
</style>
