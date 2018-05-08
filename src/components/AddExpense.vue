<template>
  <div class="add-expense modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add Expense</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Expense">
        <b-input
          type="text"
          :value="expenseItemName"
          placeholder="Your Expense"
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="saveExpense">Save</button>
    </footer>
  </div>
</template>

<script>
import { firebase } from '@/firebase'
var db = firebase.firestore();

export default {
  data () {
    return {
      expenseItemName: null
    }
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    saveExpense: function () {
      let ref = `/users/${this.currentUser.uid}/expenses/`
      console.log(ref)
      db.collection(ref).add({
        expenseName: this.expenseItemName,
        dateCreated: new Date()
      })
      .then(function(documentReference) {
        console.log('documentReference')
      })
      .catch(function(error){
        console.log('Error adding expense' + error)
      })
      this.$parent.close()
    }
  }
}
</script>