<template>
  <DefaultLayout title="Notifications">
    <!-- <div
      v-for="(notification, index) in $store.getters.getNotifications"
      :key="index"
    >
      {{ notification }}
    </div> -->
    <BaseEmpty>No notifications.</BaseEmpty>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseEmpty from "@/components/BaseEmpty";

export default {
  components: {
    BaseEmpty,
    DefaultLayout
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    fetchNotifications() {
      this.$store.dispatch("fetchNotifications");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
