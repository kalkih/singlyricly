import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth from './modules/auth'
import playback from './modules/playback'
import user from './modules/user'
import settings from './modules/settings'
import lyrics from './modules/lyrics'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    settings,
    auth,
    user,
    playback,
    lyrics,
  },
  plugins: [
    createPersistedState({
      key: 'lyricly',
      paths: ['auth', 'settings'],
    }),
  ],
})
