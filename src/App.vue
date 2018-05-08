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
import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import { firebase } from '@/firebase'

Vue.use(Buefy)

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
</style>
