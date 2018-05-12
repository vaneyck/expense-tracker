<template>
  <div class="add-expense modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add Expense</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Expense">
        <b-input
          type="text"
          v-model="expenseItemName"
          placeholder="Your Expense"
          required>
        </b-input>
      </b-field>
      <b-field label="Amount">
        <b-input
          type="number"
          v-model.number="expenseCost"
          placeholder="Cost"
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="saveExpense" :disabled="!isValidForm">Save</button>
    </footer>
  </div>
</template>

<script>
import { firebase } from '@/firebase'
var db = firebase.firestore();

export default {
  name: 'AddExpense',
  data () {
    return {
      expenseItemName: null,
      expenseCost: 0
    }
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser
    },
    isValidForm: function () {
      return (this.expenseItemName != null && this.expenseCost > 0)
    }
  },
  methods: {
    saveExpense: function () {
      let ref = `/users/${this.currentUser.uid}/expenses/`
      console.log(ref)
      db.collection(ref).add({
        expenseName: this.expenseItemName,
        expenseCost: this.expenseCost,
        dateCreated: new Date()
      })
      .then(function(documentReference) {
        console.log("Successfull added expense")
      })
      .catch(function(error){
        console.log('Error adding expense : ' + error)
      })
      this.$parent.close()
    }
  }
}
</script>