<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="signup" @submit.prevent="submit">
      <BaseSpacer mb1>
        <BaseInput v-model.trim="username" placeholder="Username" />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput v-model.trim="email" placeholder="E-mail" type="email" />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput v-model="password" placeholder="Password" type="password" />
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

<script>
  import WelcomeLayout from '@/layouts/Welcome'

  import BaseButton from '@/components/BaseButton'
  import BaseInput from '@/components/BaseInput'
  import BaseLink from '@/components/BaseLink'
  import BaseSpacer from '@/components/BaseSpacer'
  import BaseSpinner from '@/components/BaseSpinner'

  import { signUp } from '@/api'

  export default {
    components: {
      BaseButton,
      BaseInput,
      BaseLink,
      BaseSpacer,
      BaseSpinner,
      WelcomeLayout
    },
    data() {
      return {
        email: '',
        error: '',
        isLoading: false,
        password: '',
        username: ''
      }
    },
    methods: {
      async submit() {
        this.error = ''
        this.isLoading = true

        try {
          await signUp(this.username, this.email, this.password)
          this.$router.push({ name: 'home' })
        } catch (error) {
          this.error = 'Unable to sign up.'
        }

        this.isLoading = false
      }
    },
    metaInfo: {
      title: 'Sign Up'
    }
  }
</script>

<style lang="scss" scoped>
  .signup {
    text-align: center;
  }
</style>
