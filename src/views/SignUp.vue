<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="signup" @submit.prevent="submit">
      <BaseSpacer mb1>
        <BaseInput
          v-model.trim="username"
          pattern="[0-9A-Za-z_]{3,15}"
          placeholder="Username"
          required
          name="username"
        />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput
          v-model.trim="email"
          name="email"
          placeholder="E-mail"
          required
          type="email"
        />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput
          v-model="password"
          name="password"
          placeholder="Password"
          required
          type="password"
        />
      </BaseSpacer>
      <BaseButton :disabled="!username || !email || !password" type="submit">
        Sign Up
      </BaseButton>
      <BaseSpacer v-if="error" my1>
        <p>
          {{ error }}
        </p>
      </BaseSpacer>
      <BaseSpacer my1>
        <p>
          Already have an account?
          <BaseLink :to="{ name: 'login' }">Log In</BaseLink>
        </p>
      </BaseSpacer>
    </form>
  </WelcomeLayout>
</template>

<script lang="ts">
  import { defineComponent, getCurrentInstance, ref } from 'vue'

  import WelcomeLayout from '@/layouts/Welcome.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  import { signUp } from '@/api/auth'

  export default defineComponent({
    components: {
      BaseButton,
      BaseInput,
      BaseLink,
      BaseSpacer,
      BaseSpinner,
      WelcomeLayout,
    },
    setup() {
      const instance = getCurrentInstance()

      const email = ref('')
      const error = ref('')
      const isLoading = ref(false)
      const password = ref('')
      const username = ref('')

      const submit = async () => {
        error.value = ''
        isLoading.value = true

        try {
          await signUp(username.value, email.value, password.value)
          instance?.proxy.$router.push({ name: 'home' })
        } catch (err: any) {
          error.value = err.message
        }

        isLoading.value = false
      }

      return {
        email,
        error,
        isLoading,
        password,
        submit,
        username,
      }
    },
    metaInfo: {
      title: 'Sign Up',
    },
  })
</script>

<style lang="scss" scoped>
  .signup {
    text-align: center;
  }
</style>
