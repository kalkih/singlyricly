import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import LongTouch from '@/plugins/LongTouch'
import VueResize from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'
import './registerServiceWorker'

Vue.use(VueResize)
Vue.use(LongTouch)
Vue.config.productionTip = false
Vue.prototype.$dev = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
