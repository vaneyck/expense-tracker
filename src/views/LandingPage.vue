<template>
  <div>
    <section class="section has-background-info">
      <p class="is-size-1 has-text-light">Caesh</p>
      <p class="has-text-light">Track Your Expenses</p>
    </section>
    <section class="section">
      <a class="button is-large" href="/signin"
        >Login & Start Tracking Expenses</a
      >
    </section>
    <section>
      <p class="is-size-3">Track Expenses</p>
      <img class="image" src="/img/expense_list.png" />
      <hr />
    </section>
    <section class="section">
      <p class="is-size-3">Visualise Usage</p>
      <img class="image" src="/img/charts.png" />
    </section>
  </div>
</template>

<script>
import { firebase } from "@/firebase";
import router from "../router";

export default {
  mounted: function () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.replace({ path: "home" });
      }
    });
  },
};
</script>