import axios from 'axios'
import store from '@/store'

export default () => {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_SPOTIFY_API,
  })

  instance.interceptors.request.use((config) => {
    const accessToken = store.getters['auth/getAccessToken']
    if (accessToken) {
      config.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  })

  return instance
}
