import api from '@/api/spotify'

const state = {
  track: {},
  progress: null,
  updatedAt: null,
  playing: false,
}

const getters = {
  getTrack: state => state.track,
  getProgress: state => state.progress,
  getUpdatedAt: state => state.updatedAt,
  isPlaying: state => state.playing,
  hasPlayback: state => !!(state.track.title && state.track.artist),
}

const mutations = {
  setTrack (state, track) {
    state.track = track
  },

  setProgress (state, progress) {
    state.progress = progress
  },

  setUpdatedAt (state, time) {
    state.updatedAt = time
  },

  setPlaying (state, playing) {
    state.playing = playing
  },
}

const actions = {
  async fetchPlayback ({ commit }) {
    const startTime = Date.now()
    const res = await api.fetchPlayback()
    const endTime = Date.now()
    const delay = (endTime - startTime) / 2
    commit('setUpdatedAt', endTime - delay)
    commit('setTrack', res.item ? {
      title: res.item.name,
      artist: res.item.artists[0].name,
      thumbnail: res.item.album.images[1] && res.item.album.images[1].url,
      length: res.item.duration_ms,
    } : {})
    commit('setProgress', res.progress_ms || null)
    commit('setPlaying', res.is_playing || false)
  },
  async play ({ dispatch }) {
    await api.play()
    setTimeout(() => dispatch('fetchPlayback'), 100)
  },
  async pause ({ dispatch }) {
    await api.pause()
    setTimeout(() => dispatch('fetchPlayback'), 100)
  },
}

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default module
