export default {
  toggleMenu ({ commit, state }, status) {
    commit('setMenu', status || !state.menu)
  },
}
