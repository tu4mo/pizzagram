import { reactive } from 'vue'

export const fileStore = reactive<{ file: File | null }>({
  file: null,
})
