import api from '@/api/lyrics'

const state = {
  lyric: '',
}

const getters = {
  getLyric: state => state.lyric,
}

const mutations = {
  setLyric (state, track) {
    state.track = track
  },
}

const actions = {
  async fetchLyric ({ commit }, track) {
    const lyric = await api.fetchLyric(track)
    commit('setLyric', lyric)
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
