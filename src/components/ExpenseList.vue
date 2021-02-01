<template>
  <div>
    <transition-group name="list">
      <div class="columns is-mobile expense" v-for="(expense, index) in expenses" :key="expense.id">
        <div class="column is-two-thirds" @click="viewExpense(expense, index)">
          <div>{{ expense.expenseName }}</div>
          <div class="expense-date">{{ formatDate(expense.dateCreated.seconds) }}</div>
          <!-- <div
            v-if="!expense.categoryId"
            class="is-size-7 tag is-danger"
            @click="autoCategorize(expense.id)"
          >Auto Categorize</div> -->
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
    </transition-group>
  </div>
</template>

<script>
import currencyFormatter from "currency-formatter";
import { firebase } from "@/firebase";
import moment from "moment";
import axios from "axios";

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
    autoCategorize: function(expenseId) {
      var url = "https://expense-tracker-ac6d8.uc.r.appspot.com/";
      axios
        .post(url, {
          uid: this.currentUser.uid,
          expenseId: expenseId
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    viewExpense: function(expense, index) {
      var month = moment(expense.dateCreated.toDate()).format("MMMMYYYY")
      console.log(month)
      this.$router.push({
        name: "expenseView",
        params: { expenseId: expense.id, expenses: this.expenses, index: index, monthExpenseBelongsTo: month}
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