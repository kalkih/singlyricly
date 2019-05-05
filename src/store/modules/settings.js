const state = {
  delay: '',
}

const getters = {
  getDelay: state => state.delay,
}

const mutations = {
  setDelay (state, delay) {
    state.delay = delay
  },
}

const actions = {
  async setDelay ({ commit }, delay) {
    commit('setDelay', delay)
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
