import api from '@/api/auth'

const state = {
  accessToken: '',
  refreshToken: '',
  expiryTime: '',
  url: '',
}

const getters = {
  getAccessToken: state => state.accessToken,
  getRefreshToken: state => state.refreshToken,
  getExpiryTime: state => state.expiryTime,
  getAuthURL: state => state.authURL,
  isAuthenticated: state => !!state.accessToken,
}

const mutations = {
  setAuthURL (state, url) {
    state.url = url
  },
  setAccessToken (state, token) {
    state.accessToken = token
  },

  setRefreshToken (state, token) {
    state.refreshToken = token
  },

  setExpiryTime (state, time) {
    state.expiryTime = time
  },
}

const actions = {
  async fetchAuthUrl ({ commit }) {
    try {
      const url = await api.getAuthURL()
      commit('setAuthURL', url)
      return url
    } catch (e) {
      console.log(e)
    }
  },

  async login () {
    try {
      const response = await api.getAuthURL()
      if (response.data) {
        window.location.href = response.data
      }
    } catch (e) {
      console.log(e)
    }
  },

  refreshToken: async function ({ commit, state }) {
    try {
      if (state.refreshToken) {
        const response = await api.refreshToken(state.refreshToken)
        commit('setAccessToken', response.data.access_token)

        return response
      }
    } catch (e) {
      console.log(e)
    }
  },

  logout: function () {
    let script = document.createElement('script')

    script.src = 'https://www.spotify.com/logout/'
    document.getElementById('app').appendChild(script)

    window.localStorage.clear()
    window.sessionStorage.clear()

    setTimeout(function () {
      location.reload()
    }, 1000)
  },

  setAuthURL ({ commit }, url) {
    commit('setAccessToken', url)
  },

  setAccessToken ({ commit }, token) {
    commit('setAccessToken', token)
  },

  setRefreshToken ({ commit }, token) {
    commit('setRefreshToken', token)
  },

  setExpiryTime ({ commit }, time) {
    commit('setExpiryTime', time)
  },
}

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default module
