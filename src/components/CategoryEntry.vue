<template>
  <tr class="clickable" @click="goToCategoryView">
    <td>{{ categoryName }}</td>
    <td class="is-size-4 has-text-weight-bold">{{ formatAmount(totalPerCategory) }}</td>
    <td class="is-size-4 has-text-weight-bold" v-bind:class="{ 'has-text-danger' : isAboveBudget, 'has-text-info' : !isAboveBudget  }"> {{ formatAmount(categoryBudget) }}</td>
  </tr>
</template>

<script>
import _ from "lodash";
import currencyFormatter from "currency-formatter";

export default {
  props: ["categoryId", "categoryData"],
  methods: {
    formatAmount: function(amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: "" });
    },
    goToCategoryView: function() {
      this.$store.dispatch("updateRawExpenses", this.categoryData);
      this.$router.push({
        name: "categoryView",
        params: { categoryId: this.categoryId }
      });
    }
  },
  computed: {
    categories: function() {
      return this.$store.getters.getCategories;
    },
    categoryName: function() {
      let category = this.categories.find(category => {
        return category.id == this.categoryId;
      });
      if (category) {
        return category.name;
      } else {
        return "Uncategorised";
      }
    },
    isAboveBudget: function () {
      return (this.totalPerCategory > this.categoryBudget);
    },
    categoryBudget: function() {
      let category = this.categories.find(category => {
        return category.id == this.categoryId;
      });
      if (category) {
        return category.budgetedAmount;
      } else {
        return 0;
      }
    },
    totalPerCategory: function() {
      return _.sumBy(this.categoryData, function(expense) {
        return expense.expenseCost;
      });
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>