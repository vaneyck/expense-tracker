<template>
  <div class="main-content">
    <section class="section controls">
      <button class="button" @click="showEditExpenseModal">Add Expense</button>
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
      <div class="columns is-mobile expense" @click="editExpense(expense.id)" v-for="(expense, index) in expenses" :key="index">
        <div class="column">
          <div>{{ expense.expenseName }}</div>
          <div>{{ formatDate(expense.dateCreated.seconds) }}</div>
        </div>
        <div class="column">
          <span class="is-pulled-right is-size-4 has-text-weight-bold">{{ formatAmount(expense.expenseCost) }}</span>
        </div>
      </div>
      <b-loading :active.sync="isLoadingExpenses" :canCancel="false"></b-loading>
      <div v-if="(expenses.length == 0)" class="no-expenses">
        <p class="heading has-text-centered">Record some expenses</p>
      </div>
    </section>
  </div>
</template>

<script>
import currencyFormatter from 'currency-formatter'

import EditExpense from '@/components/EditExpense'
import { firebase } from '@/firebase'
import moment from 'moment'
var db = firebase.firestore();

export default {
  name: 'Home',
  data () {
    return {
      expenses: [],
      isLoadingExpenses: true
    }
  },
  mounted: function () {
    let ref = `/users/${this.currentUser.uid}/expenses/`
    console.log(ref)
    db.collection(ref)
      .onSnapshot((doc) => {
        this.expenses = doc.docs.map( d => {
          var data = d.data()
          data.id = d.id
          return data
        })
        this.isLoadingExpenses = false
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
    showEditExpenseModal: function () {
      this.$modal.open({
        parent: this,
        component: EditExpense,
        hasModalCard: true
      })
    },
    editExpense: function (expenseId) {
      this.$modal.open({
        parent: this,
        component: EditExpense,
        hasModalCard: true,
        props: {
          expenseId: expenseId
        }
      })
    },
    formatAmount: function (amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: '' })
    },
    formatDate: function (seconds) {
      return moment(new Date(seconds * 1000)).format("DD MMMM YYYY hh:mm a")
    }
  },
  components: {
    EditExpense
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.expense {
  border-bottom: 1px solid #c2c2c2;
  cursor: pointer;
}
</style>
