import request from './request'

export default {
  async getAuthURL () {
    const req = await request.get('/')
    return req.status === 200 ? req.data.url : null
  },
  async refreshAuth (token) {
    const req = await request.get('/refresh')
    return req.status === 200 ? req.data : {}
  },
}
