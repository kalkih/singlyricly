import request from './request'

export default {
  async fetchPlayback () {
    const res = await request.get('/me/player')
    return res.status === 200 ? res.data : {}
  },
  async fetchUser () {
    const res = await request.get('/me')
    return res.status === 200 ? res.data : {}
  },
  async play (uri = undefined) {
    const res = await request.put('/me/player/play', {
      ...(uri && { uris: [uri] }),
    })
    return res.status === 200 ? res.data : {}
  },
  async pause () {
    const res = await request.put('/me/player/pause')
    return res.status === 200 ? res.data : {}
  },
  async next () {
    const res = await request.post('/me/player/next')
    return res.status === 204 ? res.data : {}
  },
  async previous () {
    const res = await request.post('/me/player/previous')
    return res.status === 204 ? res.data : {}
  },
  async seek (position = 0) {
    const res = await request.put('/me/player/seek', null, {
      params: { position_ms: Number(position).toFixed() },
    })
    return res.status === 200
  },
}
