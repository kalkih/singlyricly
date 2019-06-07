const initialState = () => ({
  delay: 0,
  max: 9800,
  min: -9800,
})

const getters = {
  getDelay: state => state.delay,
}

const mutations = {
  setDelay (state, delay) {
    state.delay = delay
  },
  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
}

const actions = {
  async setDelay ({ commit }, delay) {
    commit('setDelay', delay)
  },
  async addDelay ({ commit, state }, amount = 100) {
    if (state.delay + amount <= state.max) {
      commit('setDelay', state.delay + amount)
    }
  },
  async subtractDelay ({ commit, state }, amount = 100) {
    if (state.delay - amount >= state.min) {
      commit('setDelay', state.delay - amount)
    }
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
