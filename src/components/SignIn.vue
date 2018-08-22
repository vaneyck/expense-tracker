<template>
  <div id="signin">
  </div>
</template>

<script>
import { signInUi } from '@/firebase'
import { firebase } from '@/firebase'

var db = firebase.firestore();

export default {
  mounted: function () {
    var uiConfig = {
      // TODO Find out how to generate links
      signInSuccessUrl: '/#/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: '/terms-of_service'
    }
    // The start method will wait until the DOM is loaded.
    signInUi.start('#signin', uiConfig)
  }
}
</script>