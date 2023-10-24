<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="signup" @submit.prevent="submit">
      <BaseSpacer gap="1">
        <BaseSpacer gap="1">
          <BaseInput
            v-model.trim="username"
            pattern="[0-9A-Za-z_]{3,15}"
            placeholder="Username"
            required
            name="username"
          />
          <BaseInput
            v-model.trim="email"
            name="email"
            placeholder="E-mail"
            required
            type="email"
          />
          <BaseInput
            v-model="password"
            name="password"
            placeholder="Password"
            required
            type="password"
          />
          <BaseButton
            :disabled="!username || !email || !password"
            type="submit"
          >
            Sign Up
          </BaseButton>
        </BaseSpacer>
        <BaseSpacer gap="1">
          <p v-if="error">
            {{ error }}
          </p>
          <p>
            Already have an account?
            <BaseLink :to="{ name: 'login' }">Log In</BaseLink>
          </p>
        </BaseSpacer>
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

  import { signUp } from '@/api/auth'
  import { setTitle } from '@/title'
  import { useRouter } from 'vue-router'

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

<style scoped>
  .signup {
    text-align: center;
  }
</style>
