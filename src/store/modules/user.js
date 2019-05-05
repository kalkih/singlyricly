import api from '@/api/spotify'

const state = {
  name: '',
}

const getters = {
  getName: state => state.name,
}

const mutations = {
  setName (state, name) {
    state.name = name
  },
}

const actions = {
  async fetchUser ({ commit, rootState }) {
    const user = await api.fetchUser()
    let username = user.display_name || user.id
    username = username.split(' ')[0]
    commit('setName', username)
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
