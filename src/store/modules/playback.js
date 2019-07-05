import api from '@/api/spotify'

const initialState = () => ({
  track: {},
  progress: null,
  updatedAt: null,
  playing: false,
})

const getters = {
  getTrack: state => state.track,
  getProgress: state => state.progress,
  getUpdatedAt: state => state.updatedAt,
  isPlaying: state => state.playing,
  isIdle: state => !Object.keys(state.track).length,
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

  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
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
      thumbnail: res.item.album.images[2] && res.item.album.images[2].url,
      length: res.item.duration_ms,
      uri: res.item.uri,
      id: res.item.id,
    } : {})
    commit('setProgress', res.progress_ms)
    commit('setPlaying', res.is_playing || false)
  },
  async toggle ({ dispatch, state }) {
    if (state.playing) {
      await dispatch('pause')
    } else {
      await dispatch('play')
    }
  },
  async play ({ dispatch }) {
    await api.play()
    setTimeout(() => dispatch('fetchPlayback'), 250)
  },
  async pause ({ dispatch, commit }) {
    await api.pause()
    commit('setPlaying', false)
    setTimeout(() => dispatch('fetchPlayback'), 250)
  },
  async playTrack ({ dispatch }, uri) {
    const startTime = Date.now()
    await api.playTrack(uri)
    const endTime = Date.now()
    const delay = (endTime - startTime) / 2
    setTimeout(() => dispatch('fetchPlayback'), 250)
    return { start: endTime, delay }
  },
  async clear ({ commit }) {
    commit('reset')
  },
}

const module = {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
}

export default module
