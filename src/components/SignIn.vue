<template>
  <div id="signin">
  </div>
</template>

<script>
import { signInUi } from '@/firebase'
import { firebase } from '@/firebase'
import router from '../router'

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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('updating user')
        // Store user in store
        this.$store.dispatch('updateUser', user)
        router.push({ path: 'home' })
      } else {
        console.log('not updating user')
        this.$store.dispatch('updateUser', null)
        router.push({ path: 'signin' })
      }
    })
  }
}
</script>