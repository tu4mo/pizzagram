<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import Input from './Input.vue'

  import type { Comment } from '@/api/comments'
  import { addComment, fetchComments } from '@/api/comments'
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
    <ol
      v-for="{ id, username, comment } in comments"
      :key="id"
      class="comments__list"
    >
      <li>
        <strong>{{ username }}</strong>
        &nbsp; {{ comment }}
      </li>
    </ol>
    <form @submit.prevent="submit">
      <Input
        v-model.trim="newComment"
        :disabled="isLoading"
        placeholder="Add a comment…"
      />
    </form>
  </div>
</template>

<style scoped>
  .comments {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .comments__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
  }
</style>
