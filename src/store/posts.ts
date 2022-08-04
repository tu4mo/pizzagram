import { reactive } from 'vue'

// import { Post } from '@/api/posts'

export const postsStore = reactive<{
  isLoading: boolean
  isLastPostReached: boolean
}>({
  isLoading: false,
  isLastPostReached: false,
})
