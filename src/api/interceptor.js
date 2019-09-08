import store from '@/store'

export default async (instance) => {
  instance.interceptors.response.use(async res => {
    store.dispatch('resetError')
    return res
  }, error => {
    store.dispatch('setError', {
      code: 999,
      message: `Failed to connect to ${process.env.VUE_APP_NAME} servers, check your internet connection`,
    })
    return Promise.reject(error)
  })
}
