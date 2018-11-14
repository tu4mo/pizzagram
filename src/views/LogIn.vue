<template>
  <WelcomeLayout>
    <BaseSpinner v-if="isLoading" cover />
    <form class="login" @submit.prevent="submit">
      <BaseSpacer mb1>
        <BaseInput v-model.trim="email" placeholder="E-mail" type="email" />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput v-model="password" placeholder="Password" type="password" />
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
      error: "",
      isLoading: false,
      password: ""
    };
  },
  methods: {
    async submit() {
      this.error = "";
      this.isLoading = true;

      try {
        await Firebase.signIn(this.email, this.password);
        this.$router.push({ name: "home" });
      } catch (error) {
        this.error = "Unable to sign in.";
      }

      this.isLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  text-align: center;
}
</style>
