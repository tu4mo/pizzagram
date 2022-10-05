<template>
  <DefaultLayout max-width title="Upload">
    <div class="upload">
      <BaseEmpty v-if="!file || !imageUrl">
        Use the Camera icon to upload a photo
      </BaseEmpty>
      <template v-else>
        <div ref="imageContainer" class="upload__image">
          <PostImage :image-url="imageUrl" rounded />
        </div>
        <div class="upload__form">
          <BaseSpacer mb2>
            <BaseField label="Caption">
              <BaseInput v-model.trim="form.caption" maxlength="100" />
            </BaseField>
          </BaseSpacer>
          <BaseSpacer mb2>
            <BaseField as="div" label="Rating">
              <BaseRating v-model="form.rating" />
            </BaseField>
          </BaseSpacer>
          <BaseButton @click="onShareClick">Share</BaseButton>
        </div>
      </template>
      <BaseSpinner v-if="isLoading" cover />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import DefaultLayout from '@/layouts/Default.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import BaseEmpty from '@/components/BaseEmpty.vue'
  import BaseField from '@/components/BaseField.vue'
  import BaseRating from '@/components/BaseRating.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import PostImage from '@/components/PostImage.vue'

  import { sharePost } from '@/api/posts'
  import { feedsStore } from '@/store/feeds'
  import { fileStore } from '@/store/file'
  import { setTitle } from '@/title'
  import { fetchPostsForHome } from '@/store/posts'
  import { computed, nextTick, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  setTitle('Upload')

  const router = useRouter()
  const form = reactive({ caption: '', rating: 0 })
  const imageUrl = ref<string | ArrayBuffer | null>('')
  const isLoading = ref(false)
  const imageContainer = ref<HTMLDivElement>()

  const file = computed(() => fileStore.file)

  const onFileLoad = () => {
    isLoading.value = true

    imageUrl.value = reader.result

    nextTick(async () => {
      try {
        await import('@tensorflow/tfjs-backend-cpu')
        await import('@tensorflow/tfjs-backend-webgl')

        const cocoSsd = await import('@tensorflow-models/coco-ssd')
        const model = await cocoSsd.load()
        const image = imageContainer.value!.querySelector('img')
        const predictions = await model.detect(image!)

        const isPizza = predictions.some(
          (prediction) => prediction.class === 'pizza'
        )

        if (!isPizza) {
          alert(
            "Sorry, that's no good. Make sure there's a pizza and only a pizza in the photo. Please, try another one."
          )
          imageUrl.value = ''
        }

        isLoading.value = false
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    })
  }

  const reader = new FileReader()
  reader.addEventListener('load', onFileLoad)

  watch(
    () => file.value,
    (newFile: Blob) => {
      if (newFile) {
        imageUrl.value = ''
        reader.readAsDataURL(newFile)
      }
    }
  )

  const resetForm = () => {
    form.caption = ''
    form.rating = 0
  }

  const onShareClick = async () => {
    isLoading.value = true

    await sharePost({ file: file.value, ...form })
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

  .upload__canvas {
    display: none;
    width: 100%;
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
