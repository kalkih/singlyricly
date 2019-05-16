export default {
  toggleMenu ({ commit, state }, status) {
    commit('setMenu', status || !state.menu)
  },
  reset ({ commit }) {
    commit('reset')
    commit('auth/reset')
    commit('user/reset')
    commit('settings/reset')
  },
}
