<template>
  <div class="main-content">
    <div class="fab" @click="showEditExpenseModal">
      <i class="material-icons fab-icon">fullscreen_exit</i>
    </div>
    <div class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Expense for {{ formatedMonthInView }}</p>
          <p class="title">{{ formatAmount(totalExpense) }}</p>
        </div>
      </div>
    </div>
    <div class="level contols columns is-mobile is-gapless">
      <div class="column has-text-centered">
        <button class="button is-info" @click="showPreviousMonthExpenses">{{ formattedPreviousMonth }}</button>
      </div>
      <div class="column has-text-centered">
        <button class="button is-info" @click="showCurrentMonthExpenses">Current Month</button>
      </div>
      <div class="column has-text-centered">
        <button class="button is-info" @click="showNextMonthExpenses">{{ formattedNextMonth }}</button>
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
import currencyFormatter from "currency-formatter";

import EditExpense from "@/components/EditExpense";
import { firebase } from "@/firebase";
import moment from "moment";
import _ from "lodash";
var db = firebase.firestore();

export default {
  name: "Home",
  props: ["monthToViewParam"],
  data() {
    return {
      expenses: [],
      isLoadingExpenses: true
    };
  },
  mounted: function() {
    let ref = `/users/${this.currentUser.uid}/expenses/`;
    db.collection(ref).onSnapshot(
      doc => {
        this.expenses = doc.docs.map(d => {
          var data = d.data();
          data.id = d.id;
          return data;
        });
        this.isLoadingExpenses = false;
      },
      function(error) {
        console.log(error);
      }
    );
  },
  computed: {
    monthToView: function() {
      if (this.monthToViewParam) {
        return moment(this.monthToViewParam, "MMMMYYYY").toDate();
      } else {
        return new Date();
      }
    },
    formatedMonthInView: function() {
      return moment(this.monthToView).format("MMMM YYYY");
    },
    previousMonth: function() {
      let currentDate = _.clone(this.monthToView);
      let currentMonth = currentDate.getMonth();
      let month = moment(new Date(currentDate.setMonth(currentMonth - 1)));
      return month.toDate();
    },
    nextMonth: function() {
      let currentDate = _.clone(this.monthToView);
      let currentMonth = currentDate.getMonth();
      let month = moment(new Date(currentDate.setMonth(currentMonth + 1)));
      return month.toDate();
    },
    formattedPreviousMonth: function() {
      return moment(this.previousMonth).format("MMMM YYYY");
    },
    formattedNextMonth: function() {
      return moment(this.nextMonth).format("MMMM YYYY");
    },
    selectedMonthExpenses: function() {
      let filteredExpenses = this.expenses.filter(expense => {
        let date1 = moment(new Date(expense.dateCreated.seconds * 1000)).format(
          "MMMM YYYY"
        );
        let date2 = moment(this.monthToView).format("MMMM YYYY");
        return date1 == date2;
      });
      return filteredExpenses.sort((a, b) => {
        return b.dateCreated.seconds - a.dateCreated.seconds;
      });
    },
    currentUser: function() {
      return this.$store.getters.getUser;
    },
    totalExpense: function() {
      if (this.selectedMonthExpenses.length == 0) {
        return 0;
      } else {
        return this.selectedMonthExpenses
          .map(x => x.expenseCost)
          .reduce((total, expenseCost) => {
            return total + expenseCost;
          });
      }
    }
  },
  methods: {
    showEditExpenseModal: function() {
      this.$modal.open({
        parent: this,
        component: EditExpense,
        hasModalCard: true
      });
    },
    showCurrentMonthExpenses: function() {
      let monthToGo = moment(new Date()).format("MMMMYYYY");
      this.$router.push({
        name: "monthView",
        params: { monthToViewParam: monthToGo }
      });
    },
    showPreviousMonthExpenses: function() {
      this.$router.push({
        name: "monthView",
        params: {
          monthToViewParam: moment(this.previousMonth).format("MMMMYYYY")
        }
      });
    },
    showNextMonthExpenses: function() {
      this.$router.push({
        name: "monthView",
        params: { monthToViewParam: moment(this.nextMonth).format("MMMMYYYY") }
      });
    },
    editExpense: function(expenseId) {
      this.$modal.open({
        parent: this,
        component: EditExpense,
        hasModalCard: true,
        props: {
          expenseId: expenseId
        }
      });
    },
    formatAmount: function(amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: "" });
    },
    formatDate: function(seconds) {
      return moment(new Date(seconds * 1000)).format("DD MMMM YYYY hh:mm a");
    }
  },
  components: {
    EditExpense
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.expense {
  border-bottom: 1px solid #c2c2c2;
  cursor: pointer;
}

.contols .column button {
  width: 90%;
}

.fab {
  position: fixed;
  width: 56px;
  height: 56px;
  right: 6%;
  bottom: 15px;
  border-radius: 50%;
  background: #167df0;
  cursor: pointer;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
}

.fab-icon {
  color: white;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
