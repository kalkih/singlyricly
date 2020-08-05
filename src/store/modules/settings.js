import { isWakeLockSupported, requestWakeLock, releaseWakeLock } from '../../utils/wake'

const initialState = () => ({
  delay: 0,
  max: 9800,
  min: -9800,
  keepAwake: undefined,
})

const getters = {
  getDelay: state => state.delay,
}

const mutations = {
  setDelay (state, delay) {
    state.delay = delay
  },
  setKeepAwake (state, status) {
    state.keepAwake = status
  },
  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
}

const actions = {
  setDelay ({ commit }, delay) {
    commit('setDelay', delay)
  },
  addDelay ({ commit, state }, amount = 100) {
    if (state.delay + amount <= state.max) {
      commit('setDelay', state.delay + amount)
    }
  },
  subtractDelay ({ commit, state }, amount = 100) {
    if (state.delay - amount >= state.min) {
      commit('setDelay', state.delay - amount)
    }
  },
  initKeepAwake ({ commit, state }) {
    if (state.keepAwake === undefined) {
      const initialStatus = isWakeLockSupported()
      commit('setKeepAwake', initialStatus)
    } else {
      this.keepAwake && requestWakeLock()
    }
  },
  setKeepAwake ({ commit }, status) {
    commit('setKeepAwake', status)
    status ? requestWakeLock() : releaseWakeLock()
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
