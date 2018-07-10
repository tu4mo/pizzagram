<template>
  <DefaultLayout>
    <BaseButton @click="onLogOutClick">Log Out</BaseButton>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";

import { signOut } from "@/firebase";

export default {
  components: {
    BaseButton,
    DefaultLayout
  },
  methods: {
    async onLogOutClick() {
      await signOut();
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
