<template>
  <div id="app" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/home">
          <img src="/img/icons/favicon-32x32.png"/>
          <span>Caesh</span>
        </router-link>
        <div
          class="navbar-burger burger"
          v-bind:class="{ 'is-active': mobileMenuActive }"
          @click="toggleMobileMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': mobileMenuActive }">
        <div class="navbar-end">
          <div class="navbar-item" v-if="currentUser">
            <router-link to="/settings">Settings</router-link>
          </div>
          <div class="navbar-item" v-if="currentUser">
            <b-dropdown>
              <button class="button" slot="trigger">
              <figure class="image is-24x24">
                <img :src="currentUser.photoURL">
              </figure>
              </button>
              <b-dropdown-item>
                <span class="display-name">{{ currentUser.displayName }}</span>
              </b-dropdown-item>
              <b-dropdown-item>
                <a href="#" v-on:click="signOut">Sign Out</a>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import Vue from "vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "font-awesome/css/font-awesome.min.css";
import { firebase } from "@/firebase";

Vue.use(Buefy, {
  defaultIconPack: "fa"
});

export default {
  name: "App",
  data() {
    return {
      mobileMenuActive: false
    };
  },
  computed: {
    currentUser: function() {
      return this.$store.getters.getUser;
    }
  },
  mounted: function() {
    this.determineBrowserDimensions();
  },
  methods: {
    signOut: function() {
      this.$store.dispatch("updateUser", null);
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "signin" });
        })
        .catch(error => {
          console.log("Failed Signed out" + error);
        });
    },
    toggleMobileMenu: function() {
      this.mobileMenuActive = !this.mobileMenuActive;
    },
    determineBrowserDimensions: function() {
      //> HEIGHT
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      // We listen to the resize event
      window.addEventListener("resize", () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      });
    }
  }
};
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
