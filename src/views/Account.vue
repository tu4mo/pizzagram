<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { deleteAccount } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Empty from '@/components/Empty.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { setTitle } from '@/title'

  setTitle('Account')

  const router = useRouter()

  const isLoading = ref(false)

  async function onDeleteAccountClick() {
    isLoading.value = true

    try {
      if (confirm('Are you sure you want to delete your account?')) {
        await deleteAccount()
        await router.push({ name: 'home' })
      }
    } catch {
      alert(
        'An error occurred while deleting your account. Please try again later.',
      )
    }

    isLoading.value = false
  }
</script>

<template>
  <DefaultLayout title="Account">
    <Empty>
      <Spinner v-if="isLoading" cover />
      <Button type="button" @click="onDeleteAccountClick">
        Delete Account
      </Button>
    </Empty>
  </DefaultLayout>
</template>
