<template>
  <WelcomeLayout>
    <Spinner v-if="isLoading" cover />
    <form class="reset" @submit.prevent="submit">
      <Spacer gap="1">
        <Input
          v-model.trim="email"
          :disabled="hasSentMail"
          placeholder="E-mail"
          type="email"
        />
        <Button :disabled="!email || hasSentMail" type="submit">
          Reset Password
        </Button>
        <p v-if="hasSentMail">
          Password reset email sent.
          <Link :to="{ name: 'login' }">Log In</Link>
        </p>
      </Spacer>
    </form>
  </WelcomeLayout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import { sendPasswordResetEmail } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Input from '@/components/Input.vue'
  import Link from '@/components/Link.vue'
  import Spacer from '@/components/Spacer.vue'
  import Spinner from '@/components/Spinner.vue'
  import WelcomeLayout from '@/layouts/Welcome.vue'
  import { setTitle } from '@/title'

  setTitle('Reset Password')

  const email = ref('')
  const hasSentMail = ref(false)
  const isLoading = ref(false)

  async function submit() {
    isLoading.value = true
    hasSentMail.value = false

    try {
      await sendPasswordResetEmail(email.value)
      hasSentMail.value = true
    } catch (err: any) {
      alert(err.message)
    }

    isLoading.value = false
  }
</script>

<style scoped>
  .reset {
    text-align: center;
  }
</style>
