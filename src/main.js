import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vue2TouchEvents from 'vue2-touch-events'
import './registerServiceWorker'

Vue.use(Vue2TouchEvents)
Vue.config.productionTip = false
Vue.prototype.$dev = process.env.NODE_ENV

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
