<template>
  <DefaultLayout max-width title="Upload">
    <div class="upload">
      <BaseEmpty v-if="!fileStore.file || !imageUrl">
        Use the Camera icon to upload a photo
      </BaseEmpty>
      <template v-else>
        <div ref="imageContainer" class="upload__image">
          <PostImage :image-url="imageUrl" rounded />
        </div>
        <div class="upload__form">
          <BaseSpacer gap="2">
            <BaseField label="Caption">
              <BaseInput v-model.trim="form.caption" maxlength="100" />
            </BaseField>
            <BaseButton @click="onShareClick">Share</BaseButton>
          </BaseSpacer>
        </div>
      </template>
      <BaseSpinner v-if="isLoading" cover />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { nextTick, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { cropImage, sharePost, verifyImage } from '@/api/posts'
  import BaseButton from '@/components/BaseButton.vue'
  import BaseEmpty from '@/components/BaseEmpty.vue'
  import BaseField from '@/components/BaseField.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'
  import PostImage from '@/components/PostImage.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { feedsStore } from '@/store/feeds'
  import { fileStore } from '@/store/file'
  import { fetchPostsForHome } from '@/store/posts'
  import { setTitle } from '@/title'

  setTitle('Upload')

  const router = useRouter()
  const form = reactive({ caption: '' })
  const imageUrl = ref('')
  const isLoading = ref(false)
  const imageContainer = ref<HTMLDivElement>()
  const fileReader = new FileReader()

  async function onFileLoad() {
    const result = fileReader.result as string

    if (!result) {
      return
    }

    isLoading.value = true
    imageUrl.value = await cropImage(result, 1024)

    nextTick(async () => {
      try {
        const imageAsBase64 = imageUrl.value.split(',')[1]
        const { data: isPizza } = await verifyImage(imageAsBase64)

        if (!isPizza) {
          alert(
            "Sorry, that's no good. Make sure there's a pizza and only a pizza in the photo. Please, try another one.",
          )
          imageUrl.value = ''
        }

        isLoading.value = false
      } catch (error) {
        console.error(error)

        alert('Something went wrong. Please, try again later.')

        isLoading.value = false
        imageUrl.value = ''
      }
    })
  }

  fileReader.addEventListener('load', onFileLoad)

  watch(
    () => fileStore.file,
    (newFile) => {
      if (newFile) {
        imageUrl.value = ''
        fileReader.readAsDataURL(newFile)
      }
    },
  )

  function resetForm() {
    form.caption = ''
  }

  async function onShareClick() {
    if (!fileStore.file) {
      return
    }

    isLoading.value = true

    await sharePost({ file: fileStore.file, ...form })
    fileStore.file = null

    feedsStore.feeds.home = {}
    await fetchPostsForHome()

    resetForm()

    isLoading.value = false

    router.push({ name: 'home' })
  }
</script>

<style scoped>
  .upload {
    margin: 0 auto;
  }

  .upload__form {
    padding: 1rem;
  }

  @media (min-width: 640px) {
    .upload {
      padding: 2rem;
    }

    .upload__form {
      padding: 2rem 0;
    }
  }
</style>
