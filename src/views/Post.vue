<template>
  <DefaultLayout>
    <div class="post-view">
      <template v-if="Object.keys(singlePost).length">
        <BasePost
          :is-removable="isMe"
          :post="singlePost"
          @remove-click="onRemoveClick"
        />
      </template>
    </div>
  </DefaultLayout>
</template>

<script>
  import DefaultLayout from '@/layouts/Default.vue'

  import BasePost from '@/components/BasePost.vue'
  import { authStore } from '@/store/auth'

  export default {
    components: {
      BasePost,
      DefaultLayout,
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params.postId !== from.params.postId) {
        this.fetchPost(to.params.postId)
      }
      next()
    },
    computed: {
      postId() {
        return this.$route.params.postId
      },
      singlePost() {
        return this.$store.getters.getPostById(this.postId)
      },
      isMe() {
        return authStore.getIsMe(this.singlePost.userId)
      },
    },
    created() {
      const { postId } = this.$route.params
      this.fetchPost(postId)
    },
    methods: {
      fetchPost(postId) {
        this.$store.dispatch('getPostById', { postId })
      },
      onRemoveClick() {
        this.$store.dispatch('removePost', this.postId)
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .post-view {
    margin: 0 auto;
    max-width: var(--content-width);
    padding: 1rem 0;

    @media (min-width: 640px) {
      padding: 2rem;
    }
  }
</style>
