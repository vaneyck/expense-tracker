<template>
  <div class="main-content">
    <div class="hero-body">
      <div class="container">
        <h1 v-if="expenseId" class="title has-text-info">View Expense</h1>
      </div>
    </div>
    <section v-if="expenses && expenses.length > 0">
      <div class="columns is-mobile">
        <div class="column" v-if="monthExpenseBelongsTo">
          <button class="button" @click="backToMonthView">View Month Data</button>
        </div>
        <div class="column">
          <button class="button" @click="goToPreviousExpense"><</button>
        </div>
        <div class="column has-text-centered">
          {{ index + 1 }} / {{ expenses.length }}
        </div>
        <div class="column">
          <button class="is-pulled-right button" @click="goToNextExpense"
            >></button
          >
        </div>
      </div>
    </section>
    <hr />
    <section v-if="expense">
      <p class="is-size-2 is-uppercase has-text-weight-bold">
        {{ expense.expenseName }}
      </p>
      <p class="is-size-3">{{ formatAmount(expense.expenseCost) }}</p>
      <p class="is-size-3">{{ formatDate(expense.dateCreated.toDate()) }}</p>
      <p v-if="expense.categoryId" class="is-size-5 tag is-info">
        {{ retrieveCategory(expense.categoryId) }}
      </p>
    </section>
    <hr />
    <section v-if="expense">
      <p class="is-size-5 is-family-code" v-if="expense.mpesaMessageContent">
        {{ expense.mpesaMessageContent }}
      </p>
    </section>
    <hr />
    <section>
      <a href="#" class="button" @click="editExpense()">Edit Expense</a>
    </section>
  </div>
</template>

<script>
import { firebase } from "@/firebase";
var db = firebase.firestore();

import moment from "moment";
import currencyFormatter from "currency-formatter";

export default {
  props: ["expenseId", "expenses", "index", "monthExpenseBelongsTo"],
  data() {
    return {
      categories: [],
      expense: null,
    };
  },
  mounted() {
    // pull categories
    let categoryRef = `/users/${this.currentUser.uid}/categories/`;
    db.collection(categoryRef).onSnapshot(
      (doc) => {
        let x = doc.docs.map((d) => {
          var data = d.data();
          data.id = d.id;
          return data;
        });
        this.categories = x;
        this.$store.dispatch("updateCategories", x);
      },
      function (error) {
        console.log(error);
      }
    );
    this.loadExpense();
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    goToPreviousExpense: function () {
      this.goToExpense(-1);
    },
    goToNextExpense: function () {
      this.goToExpense(1);
    },
    goToExpense: function (step) {
      var expenseIndexToGoTo = this.index + step;
      if (
        expenseIndexToGoTo < 0 ||
        expenseIndexToGoTo > this.expenses.length - 1
      ) {
        return;
      }
      let expenseToGoTo = this.expenses[expenseIndexToGoTo];
      this.$router.push({
        name: "expenseView",
        params: {
          expenseId: expenseToGoTo.id,
          expenses: this.expenses,
          index: expenseIndexToGoTo,
          monthExpenseBelongsTo: this.monthExpenseBelongsTo
        },
      });
    },
    backToMonthView: function () {
      console.log("Going to " + this.monthExpenseBelongsTo)
      this.$router.push({
        name: "monthView",
        params: { monthToViewParam: this.monthExpenseBelongsTo },
      });
    },
    loadExpense: function () {
      if (this.expenseId) {
        let ref = `/users/${this.currentUser.uid}/expenses/${this.expenseId}`;
        db.doc(ref)
          .get()
          .then((doc) => {
            if (doc.exists) {
              let expenseData = doc.data();
              this.expense = expenseData;
            } else {
              console.log("no such document available");
            }
          })
          .catch((error) => {
            console.log("error getting document : " + error);
          });
      }
    },
    editExpense: function () {
      this.$router.push({
        name: "expenseEdit",
        params: { expenseId: this.expenseId },
      });
    },
    retrieveCategory: function (categoryId) {
      let category = this.categories.find((category) => {
        return category.id == categoryId;
      });
      if (category) {
        return category.name;
      } else {
        null;
      }
    },
    formatDate: function (date) {
      return moment(date).format("DD MMMM YYYY hh:mm a");
    },
    formatAmount: function (amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: "" });
    },
  },
  watch: {
    expenseId: function () {
      this.loadExpense();
    },
  },
};
</script>