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

<script setup lang="ts">
  import DefaultLayout from '@/layouts/Default.vue'

  import BasePost from '@/components/BasePost.vue'
  import { authStore } from '@/store/auth'
  import { computed, getCurrentInstance, onActivated } from 'vue'

  const instance = getCurrentInstance()

  onActivated(() => {
    instance?.proxy.$store.dispatch('getPostById', {
      postId: instance?.proxy.$route.params.postId,
    })
  })

  const postId = computed(() => instance?.proxy.$route.params.postId)

  const singlePost = computed(() =>
    instance?.proxy.$store.getters.getPostById(postId.value)
  )

  const isMe = computed(() => authStore.getIsMe(singlePost.value.userId))

  const onRemoveClick = () => {
    instance?.proxy.$store.dispatch('removePost', postId.value)
    instance?.proxy.$router.go(-1)
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
