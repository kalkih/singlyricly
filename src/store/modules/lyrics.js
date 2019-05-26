import api from '@/api/lyrics'

const state = {
  normal: null,
  synced: null,
  found: true,
  searching: false,
}

const getters = {
  getNormal: state => state.lyrics,
  getSynced: state => state.lyrics,
  hasNormal: state => (state.normal),
  hasSynced: state => (state.synced),
}

const mutations = {
  setNormal (state, lyrics) {
    if (lyrics) {
      lyrics = lyrics.replace(/\r/g, '').split('\n')
      state.normal = lyrics
    } else {
      state.normal = lyrics
    }
  },
  setSynced (state, lyrics) {
    state.synced = lyrics
  },
  setFound (state, status) {
    state.found = status
  },
  setSearching (state, status) {
    state.found = status
  },
}

const actions = {
  async fetchLyrics ({ commit }, track) {
    commit('setSearching', true)
    const { normal, synced } = await api.fetchLyrics(track)
    commit('setNormal', normal)
    commit('setSynced', synced)
    commit('setFound', (normal || synced))
    commit('setSearching', false)
    return (normal || synced)
  },
  clearLyrics ({ commit }) {
    commit('setNormal', null)
    commit('setSynced', null)
    commit('setFound', false)
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
