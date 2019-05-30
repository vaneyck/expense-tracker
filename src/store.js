import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    rawExpenses: {}
  },
  /**
   * Use to access the data store. Never access the data directly
   */
  getters: {
    getUser(state) {
      return state.user
    },
    getRawExpenses(state) { return state.rawExpenses }
  },
  /**
   * Has to be synchronous code
   */
  mutations: {
    updateUser(state, userLoginData) {
      state.user = userLoginData
    },
    updateRawExpenses (state, rawExpenseData) {
      state.rawExpenses[rawExpenseData.month] = rawExpenseData.expenses
    }
  },
  /**
   * Can run aysynchronous code before calling mutation
   */
  actions: {
    updateUser(context, userLoginData) {
      context.commit('updateUser', userLoginData)
    },
    updateRawExpenses (context, rawExpenseData) {
      context.commit('updateRawExpenses', rawExpenseData)
    }
  }
})
