import axios from 'axios'
import store from '@/store'

export default () => {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_AUTH_API,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.response.use(async response => {
    store.dispatch('resetError')
    return response
  }, error => {
    store.dispatch('setError', {
      code: 999,
      message: `Failed to connect to ${process.env.VUE_APP_NAME}, check your connection`,
    })
    return Promise.reject(error)
  })

  return instance
}

// export default request
