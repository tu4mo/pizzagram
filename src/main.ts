import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'

const app = createApp(App)

;(async function () {
  const { initializeSentry } = await import('./sentry')
  initializeSentry(app, router)
})()

app.use(router)
app.mount('#app')
