import Color from '@/utils/colorClass'

const initialState = () => ({
  light: '',
  dark: '',
  normal: '',
  head: '#7725C1',
})

const mutations = {
  setLight (state, arr) {
    const color = new Color(...arr, { vibrant: true })
    state.light = color.lighten(50)
  },
  setDark (state, arr) {
    const color = new Color(...arr, { vibrant: true })
    state.dark = color.darken(100).desaturate(25)
  },
  set (state, arr) {
    const color = new Color(...arr, { vibrant: true })
    state.normal = color
  },
  setHead (state, arr) {
    const color = new Color(...arr, { vibrant: true })
    state.head = color.darken(25).desaturate(20).hex()
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
    commit('setHead', color)
  },
}

const module = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
}

export default module
