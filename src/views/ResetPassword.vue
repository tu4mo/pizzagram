<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="reset" @submit.prevent="submit">
      <BaseSpacer mb1>
        <BaseInput
          v-model.trim="email"
          :disabled="hasSentMail"
          placeholder="E-mail"
          type="email"
        />
      </BaseSpacer>
      <BaseButton :disabled="!email || hasSentMail" type="submit">
        Reset Password
      </BaseButton>
      <BaseSpacer my1>
        <p v-if="hasSentMail">
          Password reset email sent.
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

  import { sendPasswordResetEmail } from '@/api'

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
      const email = ref('')
      const hasSentMail = ref(false)
      const isLoading = ref(false)

      const submit = async () => {
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

      return {
        email,
        hasSentMail,
        isLoading,
        submit,
      }
    },
    metaInfo: {
      title: 'Reset Password',
    },
  })
</script>

<style lang="scss" scoped>
  .reset {
    text-align: center;
  }
</style>
