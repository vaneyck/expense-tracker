<template>
  <div class="main-content">
    <section class="section">
      <button class="button" @click="showAddExpenseModal">Add Expense</button>
    </section>
    <section class="section expenses">
      <ul>
        <li v-for="(expense, index) in expenses" :key="index">
          <span>{{ expense.expenseName }}</span>
          <span>{{ expense.expenseCost }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import AddExpense from '@/components/AddExpense'
import { firebase } from '@/firebase'
var db = firebase.firestore();

export default {
  name: 'HelloWorld',
  data () {
    return {
      isAddExpenseModalActive: false,
      expenses: []
    }
  },
  mounted: function () {
    let ref = `/users/${this.currentUser.uid}/expenses/`
    console.log(ref)
    db.collection(ref)
      .onSnapshot((doc) => {
        this.expenses = doc.docs.map( d => d.data())
    }, function(error){
      console.log(error)
    });
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser
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
