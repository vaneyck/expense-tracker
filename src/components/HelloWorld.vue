<template>
  <div class="main-content">
    <section class="section controls">
      <button class="button" @click="showAddExpenseModal">Add Expense</button>
    </section>
    <div class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Expense</p>
          <p class="title">{{ formatAmount(totalExpense) }}</p>
        </div>
      </div>
    </div>
    <section class="section expenses">
      <div class="columns is-mobile expense" v-for="(expense, index) in expenses" :key="index">
        <div class="column">{{ expense.expenseName }}</div>
        <div class="column">
          <span class="is-pulled-right is-size-4 has-text-weight-bold">{{ formatAmount(expense.expenseCost) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import currencyFormatter from 'currency-formatter'

import AddExpense from '@/components/AddExpense'
import { firebase } from '@/firebase'
var db = firebase.firestore();

export default {
  name: 'HelloWorld',
  data () {
    return {
      expenses: []
    }
  },
  mounted: function () {
    let ref = `/users/${this.currentUser.uid}/expenses/`
    console.log(ref)
    db.collection(ref)
      .onSnapshot((doc) => {
        this.expenses = doc.docs.map( d => d.data())
    }, function(error){
      console.log(error)
    });
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser
    },
    totalExpense: function () {
      if (this.expenses.length == 0) {
        return 0
      } else {
        return this.expenses.map( x=> x.expenseCost).reduce((total, expenseCost) => {
          return total + expenseCost
        });
      }
    }
  },
  methods: {
    showAddExpenseModal: function () {
      this.$modal.open({
        parent: this,
        component: AddExpense,
        hasModalCard: true
      })
    },
    formatAmount: function (amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: '' })
    }
  },
  components: {
    AddExpense
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
