<template>
  <DefaultLayout>
    <div class="post-view">
      <template v-if="Object.keys(singlePost).length">
        <BasePost
          :is-removable="$store.getters.getIsMe(singlePost.userId)"
          :post="singlePost"
          @remove-click="onRemoveClick"
        />
      </template>
    </div>
  </DefaultLayout>
</template>

<script>
  import DefaultLayout from '@/layouts/Default'

  import BasePost from '@/components/BasePost'

  export default {
    components: {
      BasePost,
      DefaultLayout,
    },
    computed: {
      postId() {
        return this.$route.params.postId
      },
      singlePost() {
        return this.$store.getters.getPostById(this.postId)
      },
    },
    created() {
      const { postId } = this.$route.params
      this.fetchPost(postId)
    },
    beforeRouteUpdate(to, from, next) {
      if (to.params.postId !== from.params.postId) {
        this.fetchPost(to.params.postId)
      }
      next()
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
    metaInfo() {
      return {
        title: this.$store.getters.getUserById(this.singlePost.userId).username,
      }
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
