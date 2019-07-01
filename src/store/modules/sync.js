import api from '@/api/lyrics'

const initialState = () => ({
  lyrics: null,
  synced: [],
  track: {},
})

const mutations = {
  setLyrics (state, lyrics) {
    state.lyrics = [ ' ', 'Intro', ...lyrics.filter(Boolean) ]
  },
  setTrack (state, track) {
    state.track = track
  },
  setSynced (state, synced) {
    state.synced = synced
  },
  push (state, line) {
    state.synced.push(line)
  },
  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
}

const actions = {
  async init ({ commit }, obj) {
    commit('setLyrics', obj.lyrics)
    commit('setTrack', obj.track)
    commit('setSynced', [])
  },
  async reset ({ commit }) {
    commit('reset')
  },
  async setLyrics ({ commit }, lyrics) {
    commit('setLyrics', lyrics)
  },
  async save ({ state, rootState }) {
    const synced = state.synced.filter(Boolean)
    return api.saveLyrics({
      track: state.track,
      user: rootState.user,
      synced,
    })
  },
  async push ({ commit }, line) {
    commit('push', line)
  },
}

const module = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
}

export default module
