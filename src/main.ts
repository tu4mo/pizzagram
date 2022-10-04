import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

import App from './App.vue'
import { router } from './router'
import { initializeAuthCallback } from './store/auth'

initializeAuthCallback()

const app = createApp(App)

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    app,
    dsn: 'https://7f76df6d0d9e4d4a84a7f3676a5d4e46@sentry.io/1319696',
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'pizzagram.cc', /^\//],
      }),
    ],
    tracesSampleRate: 1.0,
  })
}

app.use(router)
app.mount('#app')
