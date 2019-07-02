import initialState from './state'

export default {
  setMenu (state, status) {
    state.menu = status
  },
  setAbout (state, status) {
    state.about = status
  },
  setNowPlayingState (state, status) {
    state.nowPlayingState = status
  },
  reset (state) {
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },
}
