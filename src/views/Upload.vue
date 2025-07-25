<script setup lang="ts">
  import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'

  import { sharePost } from '@/api/posts'
  import Button from '@/components/Button.vue'
  import Empty from '@/components/Empty.vue'
  import Field from '@/components/Field.vue'
  import Icon from '@/components/Icon.vue'
  import Input from '@/components/Input.vue'
  import PostImage from '@/components/PostImage.vue'
  import Spacer from '@/components/Spacer.vue'
  import Spinner from '@/components/Spinner.vue'
  import DefaultLayout from '@/layouts/Default.vue'
  import { fileStore } from '@/store/file'
  import { setTitle } from '@/title'
  import { crop, rotate } from '@/utils/image'

  setTitle('Upload')

  const router = useRouter()
  const form = reactive({ caption: '' })
  const imageUrl = ref('')
  const isLoading = ref(false)
  const fileReader = new FileReader()

  async function onFileLoad() {
    const result = fileReader.result

    if (typeof result !== 'string') {
      return
    }

    imageUrl.value = await crop(result, 1024)
  }

  onMounted(() => {
    fileReader.addEventListener('load', onFileLoad)
  })

  onUnmounted(() => {
    fileReader.removeEventListener('load', onFileLoad)
  })

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
      const { data: isPizza } = await sharePost(imageAsBase64, form.caption)

      if (!isPizza) {
        alert(
          "Sorry, that's no good. Make sure there's a pizza and only a pizza in the photo. Please, try another one.",
        )

        fileStore.file = null
        isLoading.value = false

        return
      }

      resetForm()

      fileStore.file = null
      isLoading.value = false

      await router.push({ name: 'home' })
    } catch (error) {
      console.error(error)

      alert('Something went wrong. Please, try again later.')

      fileStore.file = null
      isLoading.value = false
    }
  }

  async function onRotateClick() {
    imageUrl.value = await rotate(imageUrl.value, 90)
  }
</script>

<template>
  <DefaultLayout max-width title="Upload">
    <div class="upload">
      <Empty v-if="!fileStore.file || !imageUrl">
        Use the Camera icon to upload a photo
      </Empty>
      <template v-else>
        <div class="upload__image">
          <PostImage :image-url="imageUrl" rounded />
          <button class="upload__rotate-button" @click="onRotateClick">
            <Icon name="rotateCw" />
          </button>
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

  .upload__image {
    position: relative;
  }

  .upload__rotate-button {
    align-items: center;
    background-color: rgba(var(--color-background-inverted) / 0.8);
    border: none;
    border-radius: var(--radius-sm);
    bottom: 1rem;
    color: var(--color-light);
    cursor: pointer;
    display: flex;
    height: 3rem;
    justify-content: center;
    position: absolute;
    right: 1rem;
    transition: transform var(--transition-fast);
    width: 3rem;

    &:active {
      transform: var(--button-scale);
    }
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
