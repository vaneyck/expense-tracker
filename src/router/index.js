import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SignIn from '@/components/SignIn'
import { store } from '@/store'
import { firebase } from '@/firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home/:monthToViewParam',
      name: 'monthView',
      component: Home,
      props: true
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'signin',
      component: SignIn
    }
  ]
})
var getUser = function () {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("getUser: Waiting for user", user)
      if (user) {
        store.dispatch('updateUser', user)
        resolve(user)
      } else {
        reject("User Not Available")
      }
    })
  })
}
/**
 * Redirect to the sign in page if user is not logged in
 */
router.beforeEach(async function (to, from, next) {
  // check if going to signin page and call next() to proceed
  if (to.name === 'signin') {
    console.log("ROUTER: going to signin")
    next()
  } else {
    try {
      console.log("ROUTER:", new Date(), "getting user")
      let user = await getUser();
      console.log("ROUTER:",new Date(), "got user")
      // check if the user is logged in
      console.log("ROUTER: user is logged in", user)
      console.log("ROUTER: going to requested page", to.name)
      next()
    } catch (error) {
      console.log("ROUTER: Error:", error)
      console.log("ROUTER: going to signin")
      next({ name: 'signin' })
    }
  }
})

export default router