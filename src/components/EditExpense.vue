<template>
  <div class="edit-expense">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 v-if="expenseId" class="title has-text-info">Edit Expense</h1>
          <h1 v-else class="title has-text-info">Add Expense</h1>
          <!-- <h2 class="subtitle">Hero subtitle</h2> -->
        </div>
      </div>
    </section>
    <section class="main-content">
      <b-field label="Expense">
        <b-input type="text" v-model="expense.expenseName" placeholder="Your Expense" required></b-input>
      </b-field>
      <div class="columns is-mobile">
        <div class="column">
          <b-field label="Amount">
            <b-input type="number" v-model.number="expense.expenseCost" placeholder="Cost" required></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Categories">
            <b-select
              placeholder="Select a category"
              required
              expanded
              v-model="expense.categoryId"
            >
              <option
                v-for="category in categories"
                :value="category.id"
                :key="category.id"
              >{{ category.name }}</option>
            </b-select>
          </b-field>
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column">
          <b-field v-if="expense.dateCreated" label="Date">
            <b-datepicker
              v-model="expense.dateCreated"
              placeholder="Click to select..."
              icon="calendar"
              position="is-top-right"
            >
              <button class="button is-info" @click="date = new Date()">
                <b-icon icon="calendar"></b-icon>
                <span>Today</span>
              </button>
            </b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-field v-if="expense.dateCreated" label="Time">
            <b-timepicker v-model="expense.dateCreated" :inline="false" :enable-seconds="true" :mobile-native="false" icon="clock-o"></b-timepicker>
          </b-field>
        </div>
      </div>
    </section>
    <section class="section edit-buttons">
      <button class="button" type="button" @click="$router.go(-1)">Back</button>
      <button class="button is-info" @click="saveExpense" :disabled="!isValidForm">Save</button>
      <button
        v-if="expenseId"
        class="button is-danger"
        @click="deleteExpense"
      >{{ deleteExpenseText }}</button>
    </section>
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
            this.$buefy.toast.open({
              message: "Your expense has been deleted",
              type: "is-danger",
              duration: 3000,
              position: "is-bottom"
            });
            this.$router.go(-1);
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
        console.log("Successfull saved expense");
        this.$buefy.toast.open({
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
          .set(dataToSave, { merge: true})
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
      this.$router.go(-1);
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

.edit-buttons {
  padding: 5px 15px;
}

.edit-buttons > * {
  margin-right: 10px;
}
</style>
