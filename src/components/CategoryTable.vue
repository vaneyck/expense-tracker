<template>
  <div class="category-table">
    <br />
    <div class="has-text-centered is-size-3">
      Category Spending for {{ formatedMonthInView }}
    </div>
    <br />
    <table class="table">
      <thead>
        <th>Category</th>
        <th>Amount</th>
        <th>Budgeted Amount</th>
      </thead>
      <tbody>
        <CatergoryEntry
          class="category"
          v-for="(categoryId, index) in Object.keys(categoryData)"
          :key="index"
          :categoryId="categoryId"
          :categoryData="categoryData[categoryId]"
        ></CatergoryEntry>
        <tr class="has-text-weight-bold">
          <td>TOTALS</td>
          <td class="is-size-4 has-text-weight-bold">{{ formatAmount(totalSpent) }}</td>
          <td class="is-size-4 has-text-weight-bold">{{ formatAmount(totalBudgettedFor) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from "lodash";
import CatergoryEntry from "@/components/CategoryEntry";
import currencyFormatter from "currency-formatter";

export default {
  props: ["formatedMonthInView", "selectedMonthExpenses"],
  components: {
    CatergoryEntry,
  },
  methods: {
        formatAmount: function(amount) {
      // TODO Pull code from a user's defined currency
      return currencyFormatter.format(amount, { code: "" });
    },
  },
  computed: {
    categories: function () {
      return this.$store.getters.getCategories;
    },
    categoryData: function () {
      return _.groupBy(this.selectedMonthExpenses, (expense) => {
        return expense.categoryId;
      });
    },
    totalBudgettedFor: function () {
      return _.reduce(
        this.categories,
        function (sum, n) {
          return sum + parseInt(n.budgetedAmount);
        },
        0
      );
    },
    totalSpent: function () {
            return _.reduce(
        this.selectedMonthExpenses,
        function (sum, n) {
          return sum + parseInt(n.expenseCost);
        },
        0
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.category-table {
  margin-left: 20px;
  margin-bottom: 100px;
  .table {
    width: 100%;
  }
}
</style>