<template>
  <WelcomeLayout>
    <BaseSpinner
      v-if="isLoading"
      cover
    />
    <form
      class="login"
      @submit.prevent="submit"
    >
      <BaseSpacer mb1>
        <BaseInput
          v-model="email"
          placeholder="E-mail"
        />
      </BaseSpacer>
      <BaseSpacer mb1>
        <BaseInput
          v-model="password"
          placeholder="Password"
          type="password"
        />
      </BaseSpacer>
      <BaseButton
        type="submit"
      >
        Log In
      </BaseButton>
    </form>
  </WelcomeLayout>
</template>

<script>
import WelcomeLayout from "@/layouts/Welcome";

import BaseButton from "@/components/BaseButton";
import BaseInput from "@/components/BaseInput";
import BaseSpacer from "@/components/BaseSpacer";
import BaseSpinner from "@/components/BaseSpinner";

import { signIn } from "@/firebase";

export default {
  components: {
    BaseButton,
    BaseInput,
    BaseSpacer,
    BaseSpinner,
    WelcomeLayout
  },
  data() {
    return {
      email: "",
      isLoading: false,
      password: ""
    };
  },
  methods: {
    async submit() {
      this.isLoading = true;
      await signIn(this.email, this.password);
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  margin: 0 auto;
  max-width: 640px;
  width: 100%;
}
</style>
