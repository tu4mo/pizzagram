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

<script setup lang="ts">
  import { computed, ref } from 'vue'

  import Input from './Input.vue'

  import { addComment } from '@/api/comments'

  type Props = {
    postId: string
  }

  const { postId } = defineProps<Props>()
  const comments = computed(() => [])
  const newComment = ref('')
  const isLoading = ref(false)

  async function submit() {
    isLoading.value = true

    try {
      await addComment({ comment: newComment.value, postId })
      newComment.value = ''
    } catch (err: any) {
      console.error(err)
      alert('Something went wrong. Please, try again later.')
    }

    isLoading.value = false
  }
</script>

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
