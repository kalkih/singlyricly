import api from '@/api/lyrics'

const state = {
  normal: null,
  synced: null,
  found: true,
  searching: false,
  scroll: true,
}

const getters = {
  getNormal: state => state.lyrics,
  getSynced: state => state.lyrics,
  hasNormal: state => (state.normal),
  hasSynced: state => (state.synced),
  hasLyrics: state => (state.normal || state.synced),
}

const mutations = {
  setNormal (state, lyrics) {
    if (lyrics && !Array.isArray(lyrics)) {
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
    state.searching = status
  },
  setScroll (state, status) {
    state.scroll = status
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
  async saveLyrics ({ rootState }, obj) {
    const normal = obj.lyrics.replace(/\r/g, '').split('\n')
    return api.saveLyrics({
      track: obj.track,
      user: rootState.user,
      normal,
    })
  },
  setScroll ({ commit }, status) {
    commit('setScroll', status)
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
