<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 v-if="category != null" class="title has-text-info">Category : {{ category.name }}</h1>
        </div>
      </div>
    </section>
    <section class="section" v-if="categorisedExpenses && categorisedExpenses.length > 0">
      <ExpenseList :expenses="categorisedExpenses" />
    </section>
  </div>
</template>

<script>
import { firestore } from "@/firebase";
import ExpenseList from "@/components/ExpenseList";

export default {
  props: ["categoryId"],
  components: { ExpenseList },
  mounted() {
    // Load the category name
    let ref = `/users/${this.currentUser.uid}/categories/`;
    firestore
      .collection(ref)
      .doc(this.categoryId)
      .onSnapshot(
        doc => {
          this.category = doc.data();
          this.category.id = this.categoryId;
        },
        function(error) {
          console.log(error);
        }
      );
    // Load the category expenses for that month
  },
  data() {
    return {
      categorizedExpenses: [],
      category: null
    };
  },
  computed: {
    currentUser: function() {
      return this.$store.getters.getUser;
    },
    categorisedExpenses: function() {
      return this.$store.getters.getRawExpenses;
    }
  }
};
</script>