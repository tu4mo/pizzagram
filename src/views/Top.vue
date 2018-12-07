<template>
  <DefaultLayout title="Top 5 Pizzagrammers">
    <div class="top"></div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";

import BaseButton from "@/components/BaseButton";
import BasePost from "@/components/BasePost";
import BaseSpinner from "@/components/BaseSpinner";

export default {
  components: {
    BaseButton,
    BasePost,
    BaseSpinner,
    DefaultLayout
  },
  created() {
    this.fetchTop();
  },
  methods: {
    fetchTop() {}
  }
};
</script>

<style lang="scss" scoped>
.top {
  padding: 2rem;
  position: relative;
}
</style>
