<template>
    <div>
        <p class="is-size-1">Welcome to Caesh.app</p>
        <a href="/signin">Login</a>
    </div>
</template>

<script>
import { firebase } from "@/firebase";
import router from "../router";

export default {
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        router.replace({ path: "home" });
      }
    });
  }
};
</script>