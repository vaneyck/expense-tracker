<template>
  <div id="app" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/home">
          <img src="/img/icons/favicon-32x32.png" />
          <span>Caesh</span>
        </router-link>
        <div class="navbar-item is-pulled-right" v-if="currentUser">
          <router-link to="/settings">Settings</router-link>
        </div>
      </div>
    </nav>
    <div class="main-content">
      <div class="columns is-mobile" v-if="currentUser">
        <!-- <div class="column">
          <a @click="goBack" class="button is-small">Back</a>
        </div>
        <div class="column">
          <a @click="goForward" class="button is-pulled-right is-small">Forward</a>
        </div> -->
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Buefy from "buefy";
// import BuyMeCoffee from "@/components/BuyMeCoffee";
import "buefy/dist/buefy.css";
import "font-awesome/css/font-awesome.min.css";

Vue.use(Buefy, {
  defaultIconPack: "fa",
});

export default {
  name: "App",
  components: {
    // BuyMeCoffee
  },
  data() {
    return {
      mobileMenuActive: false,
      version: "2.1",
    };
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.getUser;
    },
  },
  mounted: function () {
    this.determineBrowserDimensions();
  },
  methods: {
    determineBrowserDimensions: function () {
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
    },
    goBack: function () {
      this.$router.go(-1);
    },
    goForward: function () {
      this.$router.go(1);
    },
  },
};
</script>

<style>
.display-name {
  margin-right: 16px;
}

#app {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}
.main-content {
  padding: 10px 10px;
}
</style>
