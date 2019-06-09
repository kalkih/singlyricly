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
  async saveLyrics (lyrics, track) {
    const req = await request.post('/', {
      data: {
        lyrics,
        track,
      },
    })
    return req.status === 200 ? req.data : {}
  },
}
