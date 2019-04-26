import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null
  },
  /**
   * Use to access the data store. Never access the data directly
   */
  getters: {
    getUser(state) {
      return state.user
    }
  },
  /**
   * Has to be synchronous code
   */
  mutations: {
    updateUser(state, userLoginData) {
      state.user = userLoginData
    }
  },
  /**
   * Can run aysynchronous code before calling mutation
   */
  actions: {
    updateUser(context, userLoginData) {
      context.commit('updateUser', userLoginData)
    }
  }
})
