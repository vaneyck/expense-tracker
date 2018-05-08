<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div class="navbar">
      <a class="navbar-item" v-if="currentUser" href="#" v-on:click="signOut">Sign Out</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { firebase } from '@/firebase'

export default {
  name: 'App',
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'signin' })
      }).catch((error) => {
        console.log('Failed Signed out' + error)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
