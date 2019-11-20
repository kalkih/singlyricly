import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import playback from './modules/playback'
import user from './modules/user'
import settings from './modules/settings'
import lyrics from './modules/lyrics'
import sync from './modules/sync'
import theme from './modules/theme'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {
    settings,
    auth,
    user,
    playback,
    lyrics,
    sync,
    theme,
  },
  plugins: [
    createPersistedState({
      key: 'singlyricly',
      paths: ['auth', 'user', 'settings'],
    }),
  ],
})
