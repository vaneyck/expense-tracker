<template>
  <div id="app" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
        </a>
        <div class="navbar-item">
          <a v-if="currentUser" href="#" v-on:click="signOut">Sign Out</a>
        </div>
      </div>
    </nav>
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
