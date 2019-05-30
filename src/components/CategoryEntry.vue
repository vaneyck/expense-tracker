<template>
  <tr>
    <td>{{ categoryName }}</td>
    <td class="is-size-4 has-text-weight-bold">{{ totalPerCategory }}</td>
  </tr>
</template>

<script>
import _ from "lodash";

export default {
  props: ["categoryId", "categoryData"],
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
    totalPerCategory: function() {
      return _.sumBy(this.categoryData, function(expense) {
        return expense.expenseCost;
      });
    }
  }
};
</script>