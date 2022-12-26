import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    token: null,
    rawExpenses: {},
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
    },
    getToken(state) {
      return state.token
    },
    getRawExpenses(state) { return state.rawExpenses }
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
    },
    updateToken(state, token) {
      state.token = token
    },
    updateRawExpenses (state, rawExpenseData) {
      state.rawExpenses = rawExpenseData
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
    },
    updateToken(context, token) {
      context.commit('updateToken', token)
    },
    updateRawExpenses (context, rawExpenseData) {
      context.commit('updateRawExpenses', rawExpenseData)
    }
  }
})
