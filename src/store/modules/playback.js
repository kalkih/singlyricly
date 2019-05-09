import api from '@/api/spotify'

const state = {
  track: {},
  progress: '',
  updatedAt: '',
  playing: false,
}

const getters = {
  getTrack: state => state.track,
  getProgress: state => state.progress,
  getUpdatedAt: state => state.updatedAt,
  isPlaying: state => state.playing,
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
    const res = await api.fetchPlayback()
    commit('setTrack', {
      title: res.item.name,
      artist: res.item.artists[0].name,
      thumbnail: res.item.album.images[1].url,
      length: res.item.duration_ms,
    })
    commit('setProgress', res.progress_ms)
    commit('setUpdatedAt', res.timestamp)
    commit('setPlaying', res.is_playing)
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
