<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="reset" @submit.prevent="submit">
      <BaseSpacer gap="1">
        <BaseInput
          v-model.trim="email"
          :disabled="hasSentMail"
          placeholder="E-mail"
          type="email"
        />
        <BaseButton :disabled="!email || hasSentMail" type="submit">
          Reset Password
        </BaseButton>
        <p v-if="hasSentMail">
          Password reset email sent.
          <BaseLink :to="{ name: 'login' }">Log In</BaseLink>
        </p>
      </BaseSpacer>
    </form>
  </WelcomeLayout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import WelcomeLayout from '@/layouts/Welcome.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  import { sendPasswordResetEmail } from '@/api/auth'
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
