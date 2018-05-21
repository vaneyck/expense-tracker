<template>
  <div class="add-expense modal-card">
    <header class="modal-card-head">
      <p v-if="expenseId" class="modal-card-title">Edit Expense</p>
      <p v-else class="modal-card-title">Add Expense</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Expense">
        <b-input
          type="text"
          v-model="expense.expenseName"
          placeholder="Your Expense"
          required>
        </b-input>
      </b-field>
      <b-field label="Amount">
        <b-input
          type="number"
          v-model.number="expense.expenseCost"
          placeholder="Cost"
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="saveExpense" :disabled="!isValidForm">Save</button>
      <button v-if="expenseId" class="button is-danger" @click="deleteExpense">{{ deleteExpenseText }}</button>
    </footer>
  </div>
</template>

<script>
import { firebase } from '@/firebase'
var db = firebase.firestore();

export default {
  name: 'EditExpense',
  props: [
    'expenseId'
  ],
  data () {
    return {
      deletingExpense: false,
      editingExpense: false,
      expense: {
        expenseName: null,
        expenseCost: 0,
        dateCreated: new Date()
      }
    }
  },
  mounted () {
    // retrieve the current expense
    if (this.expenseId) {
      let ref = `/users/${this.currentUser.uid}/expenses/${this.expenseId}`
      db.doc(ref).get().then(doc => {
        if (doc.exists) {
          console.log('the document exists. available for editing')
          this.editingExpense = true
          let expenseData = doc.data()
          this.expense.expenseName = expenseData.expenseName
          this.expense.expenseCost = expenseData.expenseCost
          this.expense.dateCreated = expenseData.dateCreated
        } else {
          console.log('no such document available')
        }
      })
      .catch(error => {
        console.log('error getting document : ' + error)
      })
    } else {
      console.log("creating a new expense")
    }
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser
    },
    isValidForm: function () {
      return (this.expense.expenseName != null && this.expense.expenseCost > 0)
    },
    deleteExpenseText: function () {
      if (this.deletingExpense) {
        return "Confirm Delete"
      } else {
        return "Delete"
      }
    }
  },
  methods: {
    deleteExpense: function () {
      if (this.deletingExpense) {
        let ref = `/users/${this.currentUser.uid}/expenses/`
        db.collection(ref).doc(this.expenseId).delete()
        .then(() => {
          console.log("expense deleted")
          this.$parent.close()
        })
        .catch((error) => {
          console.log(error)
        })
      } else {
        this.deletingExpense = true
      }
    },
    saveExpense: function () {
      var dataToSave = {
        expenseName: this.expense.expenseName,
        expenseCost: this.expense.expenseCost,
        dateCreated: this.expense.dateCreated
      }
      var saveSuccessFullHanlder = (documentReference) => {
        console.log("Successfull added expense")
        this.$toast.open({
          message: 'Your expense has been recorded',
          type: 'is-success',
          duration: 3000,
          position: 'is-bottom'
        })
      }

      if (this.expenseId) {
        let ref = `/users/${this.currentUser.uid}/expenses/`
        db.collection(ref).doc(this.expenseId).set(dataToSave)
        .then(saveSuccessFullHanlder)
      } else {
        let ref = `/users/${this.currentUser.uid}/expenses/`
        console.log(ref)
        db.collection(ref).add(dataToSave)
        .then(saveSuccessFullHanlder)
        .catch((error) => {
          console.log('Error adding expense : ' + error)
        })
      }
      this.$parent.close()
    }
  }
}
</script>