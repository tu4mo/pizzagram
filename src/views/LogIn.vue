<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="login" @submit.prevent="submit">
      <BaseSpacer gap="1">
        <BaseSpacer gap="1">
          <BaseInput
            v-model.trim="email"
            name="email"
            placeholder="E-mail"
            type="email"
          />
          <BaseInput
            v-model="password"
            name="password"
            placeholder="Password"
            type="password"
          />
          <BaseButton :disabled="!email || !password" type="submit">
            Log In
          </BaseButton>
        </BaseSpacer>
        <BaseSpacer gap="1">
          <p>
            Don't have an account?
            <BaseLink :to="{ name: 'signup' }">Sign Up</BaseLink>
          </p>
          <p>
            Forgot your password?
            <BaseLink :to="{ name: 'reset-password' }">Reset Password</BaseLink>
          </p>
        </BaseSpacer>
      </BaseSpacer>
    </form>
  </WelcomeLayout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { signIn } from '@/api/auth'
  import BaseButton from '@/components/BaseButton.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'
  import WelcomeLayout from '@/layouts/Welcome.vue'
  import { setTitle } from '@/title'

  setTitle('Log In')

  const router = useRouter()
  const email = ref('')
  const isLoading = ref(false)
  const password = ref('')

  async function submit() {
    isLoading.value = true

    try {
      await signIn(email.value, password.value)
      router.push({ name: 'home' })
    } catch (error) {
      alert('Unable to sign in.')
    }

    isLoading.value = false
  }
</script>

<style scoped>
  .login {
    text-align: center;
  }
</style>
