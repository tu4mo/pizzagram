import * as Sentry from '@sentry/vue'
import type { Vue } from '@sentry/vue/types/types'
import type { Router } from 'vue-router'

export function initializeSentry(app: Vue, router: Router) {
  if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
      app,
      dsn: 'https://7f76df6d0d9e4d4a84a7f3676a5d4e46@sentry.io/1319696',
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ['localhost', 'pizzagram.cc', /^\//],
        }),
      ],
      tracesSampleRate: 1.0,
    })
  }
}
