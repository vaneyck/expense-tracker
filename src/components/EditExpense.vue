<template>
  <div class="edit-expense modal-card">
    <header class="modal-card-head">
      <p v-if="expenseId" class="modal-card-title">Edit Expense</p>
      <p v-else class="modal-card-title">Add Expense</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Expense">
        <b-input type="text" v-model="expense.expenseName" placeholder="Your Expense" required></b-input>
      </b-field>
      <b-field label="Amount">
        <b-input type="number" v-model.number="expense.expenseCost" placeholder="Cost" required></b-input>
      </b-field>
      <b-field label="Categories">
        <b-select placeholder="Select a category" required expanded v-model="expense.categoryId">
          <option
            v-for="category in categories"
            :value="category.id"
            :key="category.id"
          >{{ category.name }}</option>
        </b-select>
      </b-field>
      <b-field v-if="expense.dateCreated" label="Date">
        <b-datepicker
          v-model="expense.dateCreated"
          placeholder="Click to select..."
          icon="calendar"
          position="is-top-right"
        >
          <button class="button is-primary" @click="date = new Date()">
            <b-icon icon="calendar"></b-icon>
            <span>Today</span>
          </button>
        </b-datepicker>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="saveExpense" :disabled="!isValidForm">Save</button>
      <button
        v-if="expenseId"
        class="button is-danger"
        @click="deleteExpense"
      >{{ deleteExpenseText }}</button>
    </footer>
  </div>
</template>

<script>
import { firebase } from "@/firebase";
var db = firebase.firestore();

export default {
  name: "EditExpense",
  props: ["expenseId"],
  data() {
    return {
      categories: [],
      deletingExpense: false,
      editingExpense: false,
      expense: {
        expenseName: null,
        expenseCost: 0,
        dateCreated: null,
        categoryId: null,
        tags: []
      }
    };
  },
  mounted() {
    // retrieve categories
    let ref = `/users/${this.currentUser.uid}/categories/`;
    db.collection(ref).onSnapshot(
      doc => {
        this.categories = doc.docs.map(d => {
          var data = d.data();
          data.id = d.id;
          return data;
        });
      },
      function(error) {
        console.log(error);
      }
    );
    // retrieve the current expense
    if (this.expenseId) {
      let ref = `/users/${this.currentUser.uid}/expenses/${this.expenseId}`;
      db.doc(ref)
        .get()
        .then(doc => {
          if (doc.exists) {
            console.log("Document exists and available for editing");
            this.editingExpense = true;
            let expenseData = doc.data();
            this.expense.expenseName = expenseData.expenseName;
            this.expense.expenseCost = expenseData.expenseCost;
            this.expense.categoryId = expenseData.categoryId;
            this.expense.dateCreated = new Date(
              expenseData.dateCreated.seconds * 1000
            );
          } else {
            console.log("no such document available");
          }
        })
        .catch(error => {
          console.log("error getting document : " + error);
        });
    } else {
      console.log("creating a new expense");
      this.expense.dateCreated = new Date();
    }
  },
  computed: {
    currentUser: function() {
      return this.$store.getters.getUser;
    },
    isValidForm: function() {
      return this.expense.expenseName != null && this.expense.expenseCost > 0;
    },
    deleteExpenseText: function() {
      if (this.deletingExpense) {
        return "Confirm Delete";
      } else {
        return "Delete";
      }
    }
  },
  methods: {
    getFilteredTags: function(text) {
      this.filteredTags = this.allTags.filter(option => {
        return (
          option.tagName
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        );
      });
    },
    deleteExpense: function() {
      if (this.deletingExpense) {
        let ref = `/users/${this.currentUser.uid}/expenses/`;
        db.collection(ref)
          .doc(this.expenseId)
          .delete()
          .then(() => {
            console.log("expense deleted");
            this.$parent.close();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.deletingExpense = true;
      }
    },
    saveExpense: function() {
      var dataToSave = {
        expenseName: this.expense.expenseName,
        expenseCost: this.expense.expenseCost,
        dateCreated: this.expense.dateCreated,
        categoryId: this.expense.categoryId
      };
      var saveSuccessFullHanlder = () => {
        console.log("Successfull added expense");
        this.$toast.open({
          message: "Your expense has been recorded",
          type: "is-success",
          duration: 3000,
          position: "is-bottom"
        });
      };

      if (this.expenseId) {
        let ref = `/users/${this.currentUser.uid}/expenses/`;
        db.collection(ref)
          .doc(this.expenseId)
          .set(dataToSave)
          .then(saveSuccessFullHanlder);
      } else {
        let ref = `/users/${this.currentUser.uid}/expenses/`;
        console.log(ref);
        db.collection(ref)
          .add(dataToSave)
          .then(saveSuccessFullHanlder)
          .catch(error => {
            console.log("Error adding expense : " + error);
          });
      }
      this.$parent.close();
    }
  }
};
</script>

<style scoped>
.modal .animation-content .modal-card {
  overflow: visible !important;
}

.modal-card-body {
  overflow: visible !important;
}
</style>
