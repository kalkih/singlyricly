import axios from 'axios'

const request = axios.create({
  baseURL: process.env.VUE_APP_AUTH_API,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export default request
