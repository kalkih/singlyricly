const state = {
  delay: 0,
  max: 9800,
  min: -9800,
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
  async addDelay ({ commit, state }, amount) {
    if (state.delay + amount <= state.max) {
      commit('setDelay', state.delay + amount)
    }
  },
  async subtractDelay ({ commit, state }, amount) {
    if (state.delay - amount >= state.min) {
      commit('setDelay', state.delay - amount)
    }
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
