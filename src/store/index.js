import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import playback from './modules/playback'
import user from './modules/user'
import settings from './modules/settings'
import lyrics from './modules/lyrics'
import sync from './modules/sync'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    settings,
    auth,
    user,
    playback,
    lyrics,
    sync,
  },
  plugins: [
    createPersistedState({
      key: 'lyricly',
      paths: ['auth', 'user', 'settings'],
    }),
  ],
})
