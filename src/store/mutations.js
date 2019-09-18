import initialState from './state'

export default {
  setMenu (state, status) {
    state.menu = status
  },
  setAbout (state, status) {
    state.about = status
  },
  setPrivacyPolicy (state, status) {
    state.privacyPolicy = status
  },
  setReport (state, status) {
    state.report = status
  },
  setNowPlayingState (state, status) {
    state.nowPlayingState = status
  },
  setError (state, error) {
    state.error = {
      code: error.code,
      message: error.message,
    }
  },
  resetError (state) {
    state.error = {}
  },
  reset (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
}
