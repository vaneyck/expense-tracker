<template>
  <div class="settings-container">
    <p class="heading">Settings</p>
    <section class="category-container">
      <p>
        <span class="is-size-3">Manage Categories</span>
        <!-- <button class="button is-small is-danger" @click="learnToCategorize">Learn To Categorize</button>
        <button class="button is-small">{{ new Date(dateModelBuilt.seconds * 1000) }}</button> -->
      </p>
      <p>
        <button class="button is-small add-category" @click="showCreateCateforyModal">Add Category</button>
      </p>
      <div v-if="isLoadingCatgories">
        <b-loading :active.sync="isLoadingCatgories" :canCancel="false"></b-loading>
      </div>
      <div v-else class="category-listing">
        <div class="category" v-for="(category, id) in categories" :key="id">
          <span @click="showEditCateforyModal(category.id)">{{ category.name }}</span>
          <span class="is-pulled-right"> {{category.budgetedAmount}} </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import EditCategory from "@/components/EditCategory";
import { firebase } from "@/firebase";
import axios from "axios";
var db = firebase.firestore();

export default {
  data() {
    return {
      dateModelBuilt: 0,
      categories: null,
      isLoadingCatgories: true
    };
  },
  mounted: function() {
    let ref = `/users/${this.currentUser.uid}/categories/`;
    db.collection(ref).onSnapshot(
      doc => {
        this.categories = doc.docs.map(d => {
          var data = d.data();
          data.id = d.id;
          return data;
        });
        this.isLoadingCatgories = false;
      },
      function(error) {
        console.log(error);
        this.isLoadingCatgories = false;
      }
    );

    let modelRef = `/users/${this.currentUser.uid}/brain/model`;
    db.doc(modelRef).get().then(snapshot => {
      let map = snapshot.data()
      this.dateModelBuilt = map.dateModelBuilt
    })
  },
  computed: {
    currentUser: function() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    learnToCategorize: function() {
      var url = "https://expense-tracker-ac6d8.uc.r.appspot.com/forcelearning";
      axios
        .post(url, {
          uid: this.currentUser.uid
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    showCreateCateforyModal: function() {
      this.$buefy.modal.open({
        parent: this,
        component: EditCategory,
        hasModalCard: true
      });
    },
    showEditCateforyModal: function(categoryId) {
      this.$buefy.modal.open({
        parent: this,
        component: EditCategory,
        hasModalCard: true,
        props: {
          categoryId: categoryId
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.add-category {
  margin-left: 5px;
}
.category {
  border-bottom: 1px solid #c2c2c2;
  cursor: pointer;
}
.category-container {
  padding: 10px;
}
.category-listing .category {
  padding: 3px;
}
.settings-container {
  padding: 10px;
}
</style>
