<template>
  <div id="app" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="#">
          Expense Tracker
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
              <img :src="currentUser.photoURL"/>
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
import 'buefy/dist/buefy.css';
import 'font-awesome/css/font-awesome.min.css'
import { firebase } from '@/firebase'

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

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
  mounted: function () {
    this.determineBrowserDimensions();
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
    },
    determineBrowserDimensions: function () {
      //> HEIGHT
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      // We listen to the resize event
      window.addEventListener('resize', () => {
          // We execute the same script as before
          let vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
	  }
  }
}
</script>

<style scoped>
.display-name {
  margin-right: 16px;
}

#app {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
}
</style>
