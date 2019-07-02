export default {
  toggleMenu ({ commit, state }, status) {
    commit('setMenu', status !== undefined ? status : !state.menu)
  },
  toggleAbout ({ commit, state }, status) {
    commit('setAbout', status !== undefined ? status : !state.about)
  },
  toggleNowPlayingState ({ commit, state }, status) {
    commit('setNowPlayingState', status !== undefined ? status : !state.nowPlayingState)
  },
  reset ({ commit }) {
    commit('reset')
    commit('auth/reset')
    commit('user/reset')
    commit('settings/reset')
  },
}
