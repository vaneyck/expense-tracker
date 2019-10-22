<template>
  <div id="landing-page">
    <div class="section">
      <img src="/img/icons/android-chrome-192x192.png"/>
      <p class="is-size-1">Caesh</p>
    </div>
    <div id="signin"></div>
  </div>
</template>

<script>
import { signInUi } from "@/firebase";
import { firebase } from "@/firebase";
import router from "../router";

export default {
  mounted: function() {
    console.log("Mounted SignIn Page");
    var uiConfig = {
      // TODO Find out how to generate links
      signInSuccessUrl: "/#/",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: "/terms-of_service"
    };
    // The start method will wait until the DOM is loaded.
    signInUi.start("#signin", uiConfig);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        router.replace({ path: "home" });
      } else {
        router.push({ path: "signin" });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
#signin {
  display: inline-block;
}
#landing-page {
  text-align: center;
}
</style>