<template>
  <div id="app" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
        </a>
        <div class="navbar-burger burger" v-bind:class="{ 'is-active': mobileMenuActive }" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': mobileMenuActive }">
        <div class="navbar-end">
          <div class="navbar-item" v-if="currentUser">
            <a href="#" v-on:click="signOut">Sign Out</a>
          </div>
          <div class="navbar-item" v-if="currentUser">
            <span class="display-name">{{ currentUser.displayName }}</span>
            <figure class="image is-24x24">
              <img :src="currentUser.photoURL"></img>
            </figure>
          </div>
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
  data () {
    return {
      mobileMenuActive: false
    }
  },
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
    },
    toggleMobileMenu: function () {
      this.mobileMenuActive = !this.mobileMenuActive
    }
  }
}
</script>

<style scoped>
.display-name {
  margin-right: 16px;
}
</style>
