import axios from 'axios'
import store from '@/store'

// Refresh token margin (5 minutes)
const TTL_MARGIN = 300000

const instance = axios.create({
  baseURL: process.env.VUE_APP_SPOTIFY_API,
  validateStatus: false,
})

instance.interceptors.request.use(async (config) => {
  const expiry = store.getters['auth/getExpiryTime']
  if (expiry <= Date.now() + TTL_MARGIN) {
    console.log('Refreshing token...')
    await store.dispatch('auth/refreshToken')
  }
  const accessToken = store.getters['auth/getAccessToken']
  if (accessToken) {
    config.headers.common['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

instance.interceptors.response.use(async res => {
  return res
}, error => {
  if (error.response.status === 401) {
    console.log('refresh token')
    store.dispatch('auth/refreshToken')
    return error.response
  }
})

export default instance
