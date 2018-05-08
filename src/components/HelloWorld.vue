<template>
  <div class="main-content">
    <button class="button" @click="showAddExpenseModal">Add Expense</button>
    <div class="expenses">
      // TODO
    </div>
  </div>
</template>

<script>
import AddExpense from '@/components/AddExpense'

export default {
  name: 'HelloWorld',
  data () {
    return {
      isAddExpenseModalActive: false
    }
  },
  methods: {
    showAddExpenseModal: function () {
      this.$modal.open({
        parent: this,
        component: AddExpense,
        hasModalCard: true
      })
    }
  },
  components: {
    AddExpense
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
