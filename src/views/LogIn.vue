<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="login" @submit.prevent="submit">
      <BaseSpacer mb1>
        <BaseInput
          v-model.trim="email"
          name="email"
          placeholder="E-mail"
          type="email"
        />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput
          v-model="password"
          name="password"
          placeholder="Password"
          type="password"
        />
      </BaseSpacer>
      <BaseButton :disabled="!email || !password" type="submit">
        Log In
      </BaseButton>
      <BaseSpacer my1>
        <p>
          Don't have an account?
          <BaseLink :to="{ name: 'signup' }">Sign Up</BaseLink>
        </p>
      </BaseSpacer>
      <BaseSpacer my1>
        <p>
          Forgot your password?
          <BaseLink :to="{ name: 'reset-password' }">Reset Password</BaseLink>
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

  import { signIn } from '@/api/auth'
  import { setTitle } from '@/title'
  import { useRouter } from 'vue-router'

  setTitle('Log In')

  const router = useRouter()
  const email = ref('')
  const isLoading = ref(false)
  const password = ref('')

  const submit = async () => {
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
