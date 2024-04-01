<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { signUp } from '@/api/auth'
  import Button from '@/components/Button.vue'
  import Input from '@/components/Input.vue'
  import Link from '@/components/Link.vue'
  import Spacer from '@/components/Spacer.vue'
  import Spinner from '@/components/Spinner.vue'
  import WelcomeLayout from '@/layouts/Welcome.vue'
  import { setTitle } from '@/title'

  setTitle('Sign Up')

  const router = useRouter()

  const email = ref('')
  const error = ref('')
  const isLoading = ref(false)
  const password = ref('')
  const username = ref('')

  async function submit() {
    error.value = ''
    isLoading.value = true

    try {
      await signUp(username.value, email.value, password.value)
      router.push({ name: 'home' })
    } catch (err: any) {
      error.value = err.message
    }

    isLoading.value = false
  }
</script>

<template>
  <WelcomeLayout>
    <Spinner v-if="isLoading" cover />
    <form class="signup" @submit.prevent="submit">
      <Spacer gap="1">
        <Spacer gap="1">
          <Input
            v-model.trim="username"
            pattern="[0-9A-Za-z_]{3,15}"
            placeholder="Username"
            required
            name="username"
          />
          <Input
            v-model.trim="email"
            name="email"
            placeholder="E-mail"
            required
            type="email"
          />
          <Input
            v-model="password"
            name="password"
            placeholder="Password"
            required
            type="password"
          />
          <Button :disabled="!username || !email || !password" type="submit">
            Sign Up
          </Button>
        </Spacer>
        <Spacer gap="1">
          <p v-if="error">
            {{ error }}
          </p>
          <p>
            Already have an account?
            <Link :to="{ name: 'login' }">Log In</Link>
          </p>
        </Spacer>
      </Spacer>
    </form>
  </WelcomeLayout>
</template>

<style scoped>
  .signup {
    text-align: center;
  }
</style>
