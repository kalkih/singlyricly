import axios from 'axios'
import store from '@/store'

// Refresh token margin (5 minutes)
const TTL_MARGIN = 300000

export default () => {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_SPOTIFY_API,
  })

  instance.interceptors.request.use(async (config) => {
    const accessToken = store.getters['auth/getAccessToken']
    const expiry = store.getters['auth/getExpiryTime']
    if (expiry <= Date.now() + TTL_MARGIN) {
      console.log('Refreshing token...')
      await store.dispatch('auth/refreshToken')
    }
    if (accessToken) {
      config.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  })

  return instance
}
