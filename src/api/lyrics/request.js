import axios from 'axios'
import intercept from '../interceptor'
import defaultOpts from '../index'

const instance = axios.create({
  baseURL: process.env.VUE_APP_LYRICS_API,
  ...defaultOpts,
})

intercept(instance)

export default instance
