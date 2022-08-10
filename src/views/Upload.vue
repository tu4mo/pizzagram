<template>
  <DefaultLayout max-width title="Upload">
    <div class="upload">
      <BaseEmpty v-if="!file || !imageUrl">
        Use the Camera icon to upload a photo
      </BaseEmpty>
      <template v-else>
        <div class="upload__image">
          <PostImage ref="image" :image-url="imageUrl" rounded />
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
          <BaseSpacer v-if="!isLocationEnabled" mb2>
            <BaseField label="Restaurant">
              <BaseSelect
                :options="locations"
                :value="form.location"
                name="location"
                @change="onLocationChange"
              />
            </BaseField>
          </BaseSpacer>
          <BaseButton @click="onShareClick">Share</BaseButton>
        </div>
      </template>
      <BaseSpinner v-if="isLoading" cover />
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
  import DefaultLayout from '@/layouts/Default.vue'

  import BaseButton from '@/components/BaseButton.vue'
  import BaseEmpty from '@/components/BaseEmpty.vue'
  import BaseField from '@/components/BaseField.vue'
  import BaseRating from '@/components/BaseRating.vue'
  import BaseSelect from '@/components/BaseSelect.vue'
  import BaseSpacer from '@/components/BaseSpacer.vue'
  import BaseSpinner from '@/components/BaseSpinner.vue'
  import BaseInput from '@/components/BaseInput.vue'
  import PostImage from '@/components/PostImage.vue'

  import { addLocation, getNearbyLocations } from '@/api/locations'
  import { sharePost } from '@/api/posts'
  import { feedsStore } from '@/store/feeds'
  import { fileStore } from '@/store/file'
  import { setTitle } from '@/title'
  import { fetchPostsForHome } from '@/store/posts'

  export default {
    components: {
      BaseButton,
      BaseEmpty,
      BaseField,
      BaseRating,
      BaseSelect,
      BaseSpacer,
      BaseSpinner,
      BaseInput,
      DefaultLayout,
      PostImage,
    },
    setup() {
      setTitle('Upload')
    },
    data() {
      return {
        form: {
          caption: '',
          latitude: null,
          longitude: null,
          location: '',
          rating: 0,
        },
        imageUrl: '',
        isDetectingPizza: false,
        isLoading: false,
        isLocationEnabled: false,
        locations: [],
      }
    },
    computed: {
      file() {
        return fileStore.file
      },
    },
    watch: {
      file(newFile) {
        if (newFile) {
          this.imageUrl = ''
          this.reader.readAsDataURL(newFile)
        }
      },
    },
    created() {
      this.reader = new FileReader()
      this.reader.addEventListener('load', this.onFileLoad)
    },
    destroyed() {
      this.reader.removeEventListener('load', this.onFileLoad)
    },
    methods: {
      getNearbyLocations() {
        this.isLocationEnabled = false

        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            this.form.latitude = coords.latitude
            this.form.longitude = coords.longitude

            const locations = await getNearbyLocations(
              this.form.latitude,
              this.form.longitude
            )

            this.locations = locations.map((location) => ({
              label: location.name,
              value: location.name,
            }))

            this.isLocationEnabled = true
          })
        }
      },
      onFileLoad() {
        this.isLoading = true

        this.getNearbyLocations()

        this.imageUrl = this.reader.result

        this.$nextTick(async () => {
          try {
            await import('@tensorflow/tfjs-backend-cpu')
            await import('@tensorflow/tfjs-backend-webgl')

            const cocoSsd = await import('@tensorflow-models/coco-ssd')
            const model = await cocoSsd.load()
            const image = this.$refs.image.$el.querySelector('img')
            const predictions = await model.detect(image)

            const isPizza = predictions.some(
              (prediction) => prediction.class === 'pizza'
            )

            if (!isPizza) {
              alert(
                "Sorry, that's no good. Make sure there's a pizza and only a pizza in the photo. Please, try another one."
              )
              this.imageUrl = ''
            }

            this.isLoading = false
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
          }
        })
      },
      onLocationChange(location) {
        this.form.location = location
      },
      async onShareClick() {
        this.isLoading = true

        await sharePost({ file: this.file, ...this.form })
        fileStore.file = null

        if (
          this.form.location &&
          !this.locations.some(
            (location) => location.label === this.form.location
          )
        ) {
          await addLocation({
            name: this.form.location,
            latitude: this.form.latitude,
            longitude: this.form.longitude,
          })
        }

        feedsStore.feeds.home = {}
        await fetchPostsForHome()

        this.resetForm()

        this.isLoading = false

        this.$router.push({ name: 'home' })
      },
      resetForm() {
        this.form.caption = ''
        this.form.location = ''
        this.form.rating = 0
        this.form.latitude = null
        this.form.longitude = null
      },
    },
  }
</script>

<style lang="scss" scoped>
  .upload {
    margin: 0 auto;

    @media (min-width: 640px) {
      padding: 2rem;
    }

    &__canvas {
      display: none;
      width: 100%;
    }

    &__form {
      padding: 1rem;

      @media (min-width: 640px) {
        padding: 2rem 0;
      }
    }
  }
</style>
