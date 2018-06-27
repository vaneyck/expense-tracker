<template>
  <div class="main-content">
    <section class="section controls">
      <button class="button" @click="showEditExpenseModal">Add Expense</button>
    </section>
    <div class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Expense for {{ formatedMonthInView }}</p>
          <p class="title">{{ formatAmount(totalExpense) }}</p>
        </div>
      </div>
    </div>
    <div class="contols columns">
      <div class="column">
        <button class="button is-info is-rounded" @click="showPreviousMonthExpenses">Previous Month</button>
      </div>
      <div class="column">
        <button class="button is-info is-rounded" @click="showCurrentMonthExpenses">Current Month</button>
      </div>
      <div class="column">
        <button class="button is-info is-rounded" @click="showNextMonthExpenses">Next Month</button>
      </div>
    </div>
    <section class="section expenses">
      <div class="columns is-mobile expense" @click="editExpense(expense.id)" v-for="(expense, index) in selectedMonthExpenses" :key="index">
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
  props: ['monthToViewParam'],
  data () {
    return {
      expenses: [],
      isLoadingExpenses: true
    }
  },
  mounted: function () {
    let ref = `/users/${this.currentUser.uid}/expenses/`
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
    monthToView: function () {
      if (this.monthToViewParam) {
        return moment(this.monthToViewParam, "MMMMYYYY")
      } else {
        return new Date()
      }
    },
    formatedMonthInView: function () {
      return moment(this.monthToView).format("MMMM YYYY")
    },
    selectedMonthExpenses: function () {
      return this.expenses.filter(expense => {
        let date1 = moment(new Date(expense.dateCreated.seconds * 1000)).format("MMMM YYYY")
        let date2 = moment(this.monthToView).format("MMMM YYYY")
        return (date1 == date2)
      })
    },
    currentUser: function () {
      return this.$store.getters.getUser
    },
    totalExpense: function () {
      if (this.selectedMonthExpenses.length == 0) {
        return 0
      } else {
        return this.selectedMonthExpenses.map( x=> x.expenseCost).reduce((total, expenseCost) => {
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
    showCurrentMonthExpenses: function () {
      let monthToGo = moment(new Date()).format("MMMMYYYY")
      this.$router.push({ name: 'monthView', params: { monthToViewParam: monthToGo }})
    },
    showPreviousMonthExpenses: function () {
      let currentMonth = this.monthToView.getMonth()
      let monthToGo = moment(new Date(this.monthToView.setMonth(currentMonth - 1))).format("MMMMYYYY")
      this.$router.push({ name: 'monthView', params: { monthToViewParam: monthToGo }})
    },
    showNextMonthExpenses: function () {
      let currentMonth = this.monthToView.getMonth()
      let monthToGo = moment(new Date(this.monthToView.setMonth(currentMonth + 1))).format("MMMMYYYY")
      this.$router.push({ name: 'monthView', params: { monthToViewParam: monthToGo }})
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

.contols .column button {
  width: 100%;
}
</style>
