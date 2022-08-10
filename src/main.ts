import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

import App from './App.vue'
import router from './router'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    Vue,
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

Vue.config.productionTip = false

Vue.use(VueObserveVisibility)

new Vue({ router, render: (h) => h(App) }).$mount('#app')
