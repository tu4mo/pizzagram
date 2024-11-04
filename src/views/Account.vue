<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { deleteAccount } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Spacer from '@/components/Spacer.vue'
  import Spinner from '@/components/Spinner.vue'
  import WelcomeLayout from '@/layouts/Welcome.vue'
  import { setTitle } from '@/title'

  setTitle('Account')

  const router = useRouter()

  const isLoading = ref(false)

  async function onDeleteAccountClick() {
    isLoading.value = true

    if (confirm('Are you sure you want to delete your account?')) {
      await deleteAccount()
      router.push({ name: 'home' })
    }

    isLoading.value = false
  }
</script>

<template>
  <WelcomeLayout>
    <Spinner v-if="isLoading" cover />
    <Spacer gap="1">
      <Button type="button" @click="onDeleteAccountClick">
        Delete Account
      </Button>
    </Spacer>
  </WelcomeLayout>
</template>
