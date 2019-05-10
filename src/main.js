import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import zenscroll from 'zenscroll'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.prototype.$scroll = zenscroll

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
