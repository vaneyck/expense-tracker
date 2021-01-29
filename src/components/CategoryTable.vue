<template>
  <div class="category-table">
    <div class="has-text-centered">Category Spending for {{ formatedMonthInView }}</div>
    <table class="table">
      <thead>
        <th>Category</th>
        <th>Amount</th>
        <th>Budgeted Amount</th>
      </thead>
      <tbody>
        <CatergoryEntry
          class="category"
          v-for="(categoryId ,index) in Object.keys(categoryData)"
          :key="index"
          :categoryId="categoryId"
          :categoryData="categoryData[categoryId]"
        ></CatergoryEntry>
      </tbody>
    </table>
  </div>
</template>

<script>
import _ from "lodash";
import CatergoryEntry from "@/components/CategoryEntry";

export default {
  props: ["formatedMonthInView", "selectedMonthExpenses"],
  components: {
    CatergoryEntry
  },
  computed: {
    categoryData: function() {
      return _.groupBy(this.selectedMonthExpenses, expense => {
        return expense.categoryId;
      });
    }
  }
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