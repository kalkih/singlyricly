import axios from 'axios'
import inter from '../interceptor'
import defaultOpts from '../index'

const instance = axios.create({
  baseURL: process.env.VUE_APP_LYRICS_API,
  ...defaultOpts,
})

instance.interceptors.response.use(inter)

export default instance
