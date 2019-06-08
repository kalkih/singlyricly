const initialState = () => ({
  lyrics: null,
  uri: null,
  synced: [],
})

const getters = {
}

const mutations = {
  setLyrics (state, lyrics) {
    state.lyrics = [ ' ', 'Intro', ...lyrics.filter(Boolean) ]
  },
  setUri (state, uri) {
    state.uri = uri
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
    commit('setUri', obj.uri)
    commit('setSynced', [])
  },
  async reset ({ commit }) {
    commit('reset')
  },
  async setLyrics ({ commit }, lyrics) {
    commit('setLyrics', lyrics)
  },
  async push ({ commit }, line) {
    commit('push', line)
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
