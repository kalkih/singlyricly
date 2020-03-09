import api from '@/api/spotify'

const initialState = () => ({
  track: {},
  progress: null,
  updatedAt: null,
  playing: false,
  device: null,
  debouncePlayback: false,
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

  setDevice (state, device) {
    state.device = device
  },

  setDebouncePlayback (state, status) {
    state.debouncePlayback = status !== undefined ? status : !state.debouncePlayback
  },

  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
}

const actions = {
  async fetchPlayback ({ commit, state }) {
    if (state.debouncePlayback) return {}
    const startTime = Date.now()
    const res = await api.fetchPlayback()
    const endTime = Date.now()
    const delay = (endTime - startTime) / 2
    commit('setUpdatedAt', endTime - delay)
    const { item } = res
    commit('setTrack', item ? {
      title: item.name,
      artist: item.artists[0].name,
      thumbnail: item.album.images[2] && item.album.images[2].url,
      length: item.duration_ms,
      uri: item.uri,
      id: item.id,
    } : {})
    commit('setProgress', res.progress_ms)
    commit('setPlaying', res.is_playing || false)
    commit('setDevice', res.device ? res.device.type : null)
    return res
  },
  async toggle ({ dispatch, state }) {
    if (state.playing) {
      await dispatch('pause')
    } else {
      await dispatch('play')
    }
  },
  async play ({ dispatch }, uri = undefined) {
    await api.play(uri)
    setTimeout(() => dispatch('fetchPlayback'), 250)
  },
  async pause ({ dispatch, commit }) {
    await api.pause()
    commit('setPlaying', false)
    setTimeout(() => dispatch('fetchPlayback'), 250)
  },
  async seek ({ commit }, position = 0) {
    commit('setDebouncePlayback', true)
    commit('setUpdatedAt', new Date().getTime())
    commit('setProgress', position)
    const res = await api.seek(position)
    commit('setDebouncePlayback', false)
    return res
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
