<template>
  <div class="edit-category modal-card">
    <header class="modal-card-head">
      <p v-if="categoryId" class="modal-card-title">Edit Category</p>
      <p v-else class="modal-card-title">Add Category</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Category Name">
        <b-input type="text" v-model="catergory.name" placeholder="Your Category" required></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="saveCategory" :disabled="!isValidForm">Save</button>
      <button
        v-if="categoryId"
        class="button is-danger"
        @click="deleteCategory"
      >{{ deleteCategoryText }}</button>
    </footer>
  </div>
</template>

<script>
import { firebase } from "@/firebase";
var db = firebase.firestore();

export default {
  name: "EditCategory",
  props: ["categoryId"],
  data() {
    return {
      deletingCategory: false,
      editingCategory: false,
      catergory: {
        name: null,
      }
    };
  },
  mounted() {
    if (this.categoryId) {
      let ref = `/users/${this.currentUser.uid}/categories/${this.categoryId}`;
      db.doc(ref)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.editingCategory = true;
            let categoryData = doc.data();
            this.catergory.name = categoryData.name;
          } else {
            console.log("no such document available");
          }
        })
        .catch(error => {
          console.log("error getting document : " + error);
        });
    }
  },
  computed: {
    currentUser: function() {
      return this.$store.getters.getUser;
    },
    isValidForm: function() {
      return this.catergory.name != null;
    },
    deleteCategoryText: function() {
      if (this.deletingCategory) {
        return "Confirm Delete";
      } else {
        return "Delete";
      }
    }
  },
  methods: {
    deleteCategory: function() {
      if (this.deletingCategory) {
        let ref = `/users/${this.currentUser.uid}/categories/`;
        db.collection(ref)
          .doc(this.categoryId)
          .delete()
          .then(() => {
            console.log("category deleted");
            this.$parent.close();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.deletingCategory = true;
      }
    },
    saveCategory: function() {
      var dataToSave = {
        name: this.catergory.name,
      };
      var saveSuccessFullHanlder = () => {
        console.log("Successfull added category");
        this.$toast.open({
          message: "Your Category has been recorded",
          type: "is-success",
          duration: 3000,
          position: "is-bottom"
        });
      };

      if (this.categoryId) {
        let ref = `/users/${this.currentUser.uid}/categories/`;
        db.collection(ref)
          .doc(this.categoryId)
          .set(dataToSave)
          .then(saveSuccessFullHanlder);
      } else {
        let ref = `/users/${this.currentUser.uid}/categories/`;
        console.log(ref);
        db.collection(ref)
          .add(dataToSave)
          .then(saveSuccessFullHanlder)
          .catch(error => {
            console.log("Error adding category : " + error);
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