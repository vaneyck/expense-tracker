<template>
  <div class="main-content">
    <section class="section controls">
      <button class="button" @click="showAddExpenseModal">Add Expense</button>
    </section>
    <section class="section expenses">
      <div class="columns is-mobile" v-for="(expense, index) in expenses" :key="index">
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
      isAddExpenseModalActive: false,
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
