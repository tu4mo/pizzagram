import * as Sentry from '@sentry/vue'
import type { Router } from 'vue-router'

export function initializeSentry(
  app: Sentry.VueIntegrationOptions['app'],
  router: Router,
) {
  if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
      app,
      dsn: 'https://7f76df6d0d9e4d4a84a7f3676a5d4e46@sentry.io/1319696',
      integrations: [Sentry.browserTracingIntegration({ router })],
      tracePropagationTargets: ['localhost', 'pizzagram.cc'],
      tracesSampleRate: 1.0,
    })
  }
}
