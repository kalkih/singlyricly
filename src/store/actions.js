export default {
  toggleMenu ({ commit, state }, status) {
    commit('setMenu', status !== undefined ? status : !state.menu)
  },
  closeSecondary ({ commit }) {
    commit('setAbout', false)
    commit('setPrivacyPolicy', false)
    commit('setReport', false)
  },
  toggleAbout ({ commit, state }, status) {
    commit('setAbout', status !== undefined ? status : !state.about)
  },
  togglePrivacyPolicy ({ commit, state }, status) {
    commit('setPrivacyPolicy', status !== undefined ? status : !state.privacyPolicy)
  },
  toggleReport ({ commit, state }, status) {
    commit('setReport', status !== undefined ? status : !state.report)
  },
  toggleNowPlayingState ({ commit, state }, status) {
    commit('setNowPlayingState', status !== undefined ? status : !state.nowPlayingState)
  },
  setError ({ commit }, error) {
    commit('setError', error)
  },
  resetError ({ commit }) {
    commit('resetError')
  },
  reset ({ commit }) {
    commit('reset')
    commit('auth/reset')
    commit('user/reset')
    commit('settings/reset')
    commit('theme/reset')
  },
}
