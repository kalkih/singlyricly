import api from '@/api/spotify'

const initialState = () => ({
  name: '',
})

const getters = {
  getName: state => state.name,
}

const mutations = {
  setName (state, name) {
    state.name = name
  },
  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
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
  state: initialState,
  getters,
  mutations,
  actions,
}

export default module
