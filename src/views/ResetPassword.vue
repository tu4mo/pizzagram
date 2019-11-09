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

<script>
  import WelcomeLayout from "@/layouts/Welcome";

  import BaseButton from "@/components/BaseButton";
  import BaseInput from "@/components/BaseInput";
  import BaseLink from "@/components/BaseLink";
  import BaseSpacer from "@/components/BaseSpacer";
  import BaseSpinner from "@/components/BaseSpinner";

  import Firebase from "@/firebase";

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
        email: "",
        hasSentMail: false,
        isLoading: false
      };
    },
    methods: {
      async submit() {
        this.isLoading = true;
        await Firebase.auth.sendPasswordResetEmail(this.email);
        this.isLoading = false;
        this.hasSentMail = true;
      }
    },
    metaInfo: {
      title: "Reset Password"
    }
  };
</script>

<style lang="scss" scoped>
  .reset {
    text-align: center;
  }
</style>
