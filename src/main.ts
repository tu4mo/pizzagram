import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import Meta from 'vue-meta'

import App from './App.vue'
import router from './router'
import store from './store'

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

Vue.use(Meta)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
