import request from './request'

const subdomain = process.env.VUE_APP_SUBDOMAIN

export default {
  async getAuthURL () {
    const req = await request.get('/', {
      ...(subdomain && {
        params: { sub: subdomain },
      }),
    })
    return req.status === 200 ? req.data.url : null
  },
  async refreshToken (token) {
    const req = await request.get('/refresh', {
      params: { token },
    })
    return req.status === 200 ? req.data : null
  },
}
