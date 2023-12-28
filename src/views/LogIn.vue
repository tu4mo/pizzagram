<template>
  <WelcomeLayout>
    <Spinner v-if="isLoading" cover />
    <form class="login" @submit.prevent="submit">
      <Spacer gap="1">
        <Spacer gap="1">
          <Input
            v-model.trim="email"
            name="email"
            placeholder="E-mail"
            type="email"
          />
          <Input
            v-model="password"
            name="password"
            placeholder="Password"
            type="password"
          />
          <Button :disabled="!email || !password" type="submit">Log In</Button>
        </Spacer>
        <Spacer gap="1">
          <p>
            Don't have an account?
            <Link :to="{ name: 'signup' }">Sign Up</Link>
          </p>
          <p>
            Forgot your password?
            <Link :to="{ name: 'reset-password' }">Reset Password</Link>
          </p>
        </Spacer>
      </Spacer>
    </form>
  </WelcomeLayout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { signIn } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Input from '@/components/Input.vue'
  import Link from '@/components/Link.vue'
  import Spacer from '@/components/Spacer.vue'
  import Spinner from '@/components/Spinner.vue'
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
