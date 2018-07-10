<template>
  <WelcomeLayout>
    <form @submit.prevent="submit">
      <BaseInput
        v-model="email"
        placeholder="E-mail"
      />
      <BaseInput
        v-model="password"
        placeholder="Password"
        type="password"
      />
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

import { signIn } from "@/firebase";

export default {
  components: {
    BaseButton,
    BaseInput,
    WelcomeLayout
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async submit() {
      await signIn(this.email, this.password);
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
