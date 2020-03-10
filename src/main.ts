import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import VueObserveVisibility from 'vue-observe-visibility'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Meta from 'vue-meta'

import App from './App.vue'
import router from './router'
import store from './store'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://7f76df6d0d9e4d4a84a7f3676a5d4e46@sentry.io/1319696',
    integrations: [
      new Integrations.Vue({
        Vue,
        attachProps: true
      })
    ]
  })
}

Vue.config.productionTip = false

Vue.use(VueCompositionApi)
Vue.use(VueObserveVisibility)

Vue.use(Meta)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
