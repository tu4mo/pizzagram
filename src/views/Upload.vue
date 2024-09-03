<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { cropImage, sharePost, verifyImage } from '@/api/posts'
  import Button from '@/components/Button.vue'
  import Empty from '@/components/Empty.vue'
  import Field from '@/components/Field.vue'
  import Input from '@/components/Input.vue'
  import PostImage from '@/components/PostImage.vue'
  import Spacer from '@/components/Spacer.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { fileStore } from '@/store/file'
  import { setTitle } from '@/title'

  setTitle('Upload')

  const router = useRouter()
  const form = reactive({ caption: '' })
  const imageUrl = ref('')
  const isLoading = ref(false)
  const imageContainer = ref<HTMLDivElement>()
  const fileReader = new FileReader()

  async function onFileLoad() {
    const result = fileReader.result

    if (typeof result !== 'string') {
      return
    }

    imageUrl.value = await cropImage(result, 1024)
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

    try {
      const imageAsBase64 = imageUrl.value.split(',')[1] ?? ''
      const { data: isPizza } = await verifyImage(imageAsBase64)

      if (!isPizza) {
        alert(
          "Sorry, that's no good. Make sure there's a pizza and only a pizza in the photo. Please, try another one.",
        )

        fileStore.file = null
        isLoading.value = false

        return
      }

      await sharePost({ file: fileStore.file, ...form })
      fileStore.file = null

      resetForm()

      isLoading.value = false

      router.push({ name: 'home' })
    } catch (error) {
      console.error(error)

      alert('Something went wrong. Please, try again later.')

      isLoading.value = false
      fileStore.file = null
    }
  }
</script>

<template>
  <DefaultLayout max-width title="Upload">
    <div class="upload">
      <Empty v-if="!fileStore.file || !imageUrl">
        Use the Camera icon to upload a photo
      </Empty>
      <template v-else>
        <div ref="imageContainer" class="upload__image">
          <PostImage :image-url="imageUrl" rounded />
        </div>
        <div class="upload__form">
          <Spacer gap="2">
            <Field label="Caption">
              <Input v-model.trim="form.caption" maxlength="100" />
            </Field>
            <Button @click="onShareClick">Share</Button>
          </Spacer>
        </div>
      </template>
      <Spinner v-if="isLoading" cover />
    </div>
  </DefaultLayout>
</template>

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
