import request from './request'

export default {
  async fetchLyric (track) {
    const req = await request.get('/', {
      track,
    })
    return req.status === 200 ? req.data : {}
  },
}
