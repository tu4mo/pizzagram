<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="signup" @submit.prevent="submit">
      <BaseSpacer mb1>
        <BaseInput
          v-model.trim="username"
          placeholder="Username"
          minlength="3"
          maxlength="15"
        />
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

<script lang="ts">
  import { defineComponent, ref } from '@vue/composition-api'

  import WelcomeLayout from '@/layouts/Welcome.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import BaseLink from '@/components/BaseLink.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'

  import { signUp } from '@/api'

  export default defineComponent({
    components: {
      BaseButton,
      BaseInput,
      BaseLink,
      BaseSpacer,
      BaseSpinner,
      WelcomeLayout,
    },
    setup(props, context) {
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
          context.root.$router.push({ name: 'home' })
        } catch (error) {
          error.value = 'Unable to sign up.'
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
