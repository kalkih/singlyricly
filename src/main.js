import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from './store'
import LongTouch from '@/plugins/LongTouch'
import VueResize from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'
import './registerServiceWorker'

const app = createApp(App)
  .use(router)
  .use(store)
  .use(VueResize)
  .use(LongTouch)

// app.config.globalProperties.$dev = process.env.NODE_ENV === 'development'
app.config.globalProperties.$dev = process.env.NODE_ENV === 'development'

app.mount('#app')
