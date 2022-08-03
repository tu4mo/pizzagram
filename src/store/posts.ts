import { reactive } from 'vue'

// import { Post } from '@/api/posts'

export const postsStore = reactive<{
  isLoading: boolean
}>({
  isLoading: false,
})
