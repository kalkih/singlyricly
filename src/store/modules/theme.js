import getHsl from '@/utils/color'

const initialState = () => ({
  light: 'var(--default-color)',
  dark: 'var(--default-dark-color)',
  normal: 'var(--default-color)',
})

const mutations = {
  setLight (state, color) {
    state.light = getHsl(color, -25)
  },
  setDark (state, color) {
    state.dark = getHsl(color, 40)
  },
  set (state, color) {
    state.normal = getHsl(color)
  },
  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
}

const actions = {
  setLight ({ commit }, color) {
    commit('setLight', color)
  },
  setDark ({ commit }, color) {
    commit('setDark', color)
  },
  set ({ commit }, color) {
    commit('set', color)
  },
  setAll ({ commit }, color) {
    commit('setLight', color)
    commit('set', color)
    commit('setDark', color)
  },
}

const module = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
}

export default module
