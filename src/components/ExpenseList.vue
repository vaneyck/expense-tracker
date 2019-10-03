<template>
  <div>
    <div
      class="columns is-mobile expense"
      @click="editExpense(expense.id)"
      v-for="expense in expenses"
      :key="expense.id"
    >
      <div class="column">
        <div>{{ expense.expenseName }}</div>
        <div class="expense-date">{{ formatDate(expense.dateCreated.seconds) }}</div>
        <div
          v-if="expense.categoryId"
          class="is-size-7 tag is-info"
        >{{ retrieveCategory(expense.categoryId) }}</div>
      </div>
      <div class="column">
        <span
          class="is-pulled-right is-size-4 has-text-weight-bold"
        >{{ formatAmount(expense.expenseCost) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import currencyFormatter from "currency-formatter";
import { firebase } from "@/firebase";
import moment from "moment";

var db = firebase.firestore();

export default {
  props: ["expenses"],
  data() {
    return {
      categories: []
    };
  },
  mounted: function() {
    // pull categories
    let categoryRef = `/users/${this.currentUser.uid}/categories/`;
    db.collection(categoryRef).onSnapshot(
      doc => {
        let x = doc.docs.map(d => {
          var data = d.data();
          data.id = d.id;
          return data;
        });
        this.categories = x;
        this.$store.dispatch("updateCategories", x);
      },
      function(error) {
        console.log(error);
      }
    );
  },
  computed: {
    currentUser: function() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    editExpense: function(expenseId) {
      this.$router.push({
        name: "expenseEdit",
        params: { expenseId: expenseId }
      });
    },
    formatDate: function(seconds) {
      return moment(new Date(seconds * 1000)).format("DD MMMM YYYY hh:mm a");
    },
    retrieveCategory: function(categoryId) {
      let category = this.categories.find(category => {
        return category.id == categoryId;
      });
      if (category) {
        return category.name;
      } else {
        null;
      }
    },
    formatAmount: function(amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: "" });
    }
  }
};
</script>
<style scoped>
.expense {
  border-bottom: 1px solid #c2c2c2;
  cursor: pointer;
}

.expense-date {
  font-size: 0.8em;
}
</style>