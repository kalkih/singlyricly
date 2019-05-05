import request from './request'

export default {
  async fetchPlayback () {
    const res = await request().get('/me/player')
    return res.status === 200 ? res.data : {}
  },
  async fetchUser () {
    const res = await request().get('/me')
    return res.status === 200 ? res.data : {}
  },
}
