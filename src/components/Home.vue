<template>
  <div class="main-content">
    <div class="fab" @click="showEditExpenseModal">
      <i class="material-icons fab-icon">add</i>
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
        <button
          class="button is-info"
          @click="showPreviousMonthExpenses"
          :title="formattedPreviousMonth"
        >
          <i class="material-icons">chevron_left</i>
        </button>
      </div>
      <div class="column has-text-centered">
        <button class="button is-info" @click="showCurrentMonthExpenses">Current Month</button>
      </div>
      <div class="column has-text-centered">
        <button class="button is-info" @click="showNextMonthExpenses" :title="formattedNextMonth">
          <i class="material-icons">chevron_right</i>
        </button>
      </div>
    </div>
    <div class="tabs is-centered">
      <ul>
        <li :class="{ 'is-active' : listActive }" @click="showListTab">
          <a>List</a>
        </li>
        <li :class="{ 'is-active' : statsActive }" @click="showStatsTab">
          <a>Stats</a>
        </li>
      </ul>
    </div>
    <section v-if="listActive" class="section expenses">
      <ExpenseList :expenses="selectedMonthExpenses" />
      <b-loading :active.sync="isLoadingExpenses" :canCancel="false"></b-loading>
      <div v-if="(selectedMonthExpenses.length == 0)" class="no-expenses">
        <p class="heading has-text-centered">Record some expenses for {{ formatedMonthInView }}</p>
      </div>
    </section>
    <section v-if="statsActive" class="section stats">
      <div class="has-text-centered">Stats for {{ formatedMonthInView }}</div>
      <line-chart :chart-data="chartData" :options="chartOptions" />
      <CategoryTable
        :selectedMonthExpenses="selectedMonthExpenses"
        :formatedMonthInView="formatedMonthInView"
      ></CategoryTable>
    </section>
  </div>
</template>

<script>
import currencyFormatter from "currency-formatter";

import EditExpense from "@/components/EditExpense";
import CategoryTable from "@/components/CategoryTable";
import LineChart from "@/components/LineChart";
import ExpenseList from "@/components/ExpenseList";
import { firebase } from "@/firebase";
import moment from "moment";
import _ from "lodash";
var db = firebase.firestore();

export default {
  name: "Home",
  props: ["monthToViewParam"],
  data() {
    return {
      selectedMonthExpenses: [],
      isLoadingExpenses: true,
      listActive: true,
      statsActive: false
    };
  },
  mounted: function() {
    this.pullExpensesForSelectedMonth(null);
  },
  computed: {
    rawExpenses: function() {
      return this.$store.getters.getRawExpenses;
    },
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
    },
    chartData: function() {
      let groupedExpenses = _.groupBy(this.selectedMonthExpenses, expense => {
        return moment(new Date(expense.dateCreated.seconds * 1000)).format(
          "DD MMMM YYYY"
        );
      });
      let orderedDatesAsString = Object.keys(groupedExpenses);
      let orderedDates = _.map(orderedDatesAsString, dateAsString => {
        return moment(dateAsString, "DD MMMM YYYY").toDate();
      });
      let sumedByDayExpenses = _.map(orderedDates, date => {
        let expensesForDay =
          groupedExpenses[moment(date).format("DD MMMM YYYY")];
        return _.sum(
          _.map(expensesForDay, expense => {
            return expense.expenseCost;
          })
        );
      });
      return {
        labels: orderedDates,
        datasets: [
          {
            label: this.formatedMonthInView,
            lineTension: 0,
            data: sumedByDayExpenses,
            borderColor: "#167df0",
            backgroundColor: "#167df044"
          }
        ]
      };
    },
    chartOptions: function() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              distribution: "series",
              ticks: {
                source: "labels"
              }
            }
          ]
        }
      };
    }
  },
  methods: {
    pullExpensesForSelectedMonth: function(monthToPullDataFor) {
      if (!monthToPullDataFor) {
        monthToPullDataFor = new Date();
      }
      this.isLoadingExpenses = true;
      let monthAsString = moment(monthToPullDataFor).format("MMMMYYYY");

      let ref = `/users/${this.currentUser.uid}/expenses/`;
      ref = db.collection(ref);
      let lowerLimit = new Date(
        moment(monthToPullDataFor.setDate(1)).format("YYYY-MM-DD")
      );

      // calculate the next month
      let currentDate = _.clone(monthToPullDataFor);
      let currentMonth = currentDate.getMonth();
      let month = moment(new Date(currentDate.setMonth(currentMonth + 1)));
      let nextMonth = month.toDate();

      let upperLimit = new Date(
        moment(nextMonth.setDate(1)).format("YYYY-MM-DD")
      );
      console.log("lowerLimit", lowerLimit);
      console.log("upperLimit", upperLimit);

      let query = ref
        .where("dateCreated", ">=", lowerLimit)
        .where("dateCreated", "<", upperLimit);
      query.onSnapshot(snapshot => {
        let expenses = snapshot.docs.map(d => {
          var data = d.data();
          data.id = d.id;
          return data;
        });
        this.$store.dispatch("updateRawExpenses", {
          month: monthAsString,
          expenses: expenses
        });
        if (moment(monthToPullDataFor).format("MMMMYYYY") == monthAsString) {
          this.selectedMonthExpenses = expenses.sort((a, b) => {
            return b.dateCreated.seconds - a.dateCreated.seconds;
          });
        }
        this.isLoadingExpenses = false;
      });
    },
    showEditExpenseModal: function() {
      this.$buefy.modal.open({
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
    formatAmount: function(amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: "" });
    },
    showStatsTab: function() {
      this.listActive = false;
      this.statsActive = true;
    },
    showListTab: function() {
      this.listActive = true;
      this.statsActive = false;
    }
  },
  components: {
    LineChart,
    CategoryTable,
    ExpenseList
  },
  watch: {
    monthToViewParam: function() {
      this.pullExpensesForSelectedMonth(this.monthToView);
    }
  }
};
</script>

<style scoped>
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
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}

.fab-icon {
  color: white;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
