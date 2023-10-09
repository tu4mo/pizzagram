import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'
import { initializeAuthCallback } from './store/auth'

initializeAuthCallback()

const app = createApp(App)

;(async () => {
  const { initializeSentry } = await import('./sentry')
  initializeSentry(app, router)
})()

app.use(router)
app.mount('#app')
