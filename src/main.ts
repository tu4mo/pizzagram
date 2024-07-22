import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'
import { initializeAuth } from './store/auth'

initializeAuth()

const app = createApp(App)

;(async function () {
  const { initializeSentry } = await import('./sentry')
  initializeSentry(app, router)
})()

app.use(router)
app.mount('#app')

window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})
