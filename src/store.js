import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    categories: []
  },
  /**
   * Use to access the data store. Never access the data directly
   */
  getters: {
    getCategories(state) {
      return state.categories
    },
    getUser(state) {
      return state.user
    }
  },
  /**
   * Has to be synchronous code
   */
  mutations: {
    updateCategories(state, categories) {
      state.categories = categories
    },
    updateUser(state, userLoginData) {
      state.user = userLoginData
    }
  },
  /**
   * Can run aysynchronous code before calling mutation
   */
  actions: {
    updateCategories(context, categories) {
      context.commit('updateCategories', categories)
    },
    updateUser(context, userLoginData) {
      context.commit('updateUser', userLoginData)
    }
  }
})
