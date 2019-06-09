import api from '@/api/spotify'

const initialState = () => ({
  id: '',
  name: '',
  alias: '',
})

const getters = {
  getAlias: state => state.alias,
}

const mutations = {
  setId (state, id) {
    state.id = id
  },
  setName (state, name) {
    state.name = name
  },
  setAlias (state, alias) {
    state.alias = alias
  },
  reset (state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
}

const actions = {
  async fetchUser ({ commit }) {
    const user = await api.fetchUser()
    commit('setId', user.id)
    commit('setName', user.display_name)
    commit('setAlias', user.display_name.split(' ')[0])
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
