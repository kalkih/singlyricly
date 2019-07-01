import request from './request'

export default {
  async fetchLyrics (track) {
    const { id, title, artist, length } = track
    const req = await request.get('/', {
      validateStatus: false,
      params: { id, title, artist, length },
    })
    return req.status === 200 ? req.data : {}
  },
  async saveLyrics (data) {
    try {
      const req = await request.post('/', {
        validateStatus: false,
        data,
      })
      return req.status === 201 ? 1 : 0
    } catch (err) {
      return 0
    }
  },
}
