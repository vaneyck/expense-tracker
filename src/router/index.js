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
var getUser = new Promise( resolve => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      store.dispatch('updateUser', user)
      resolve(user)
    }
  })
})
/**
 * Redirect to the sign in page if user is not logged in
 */
router.beforeEach((to, from, next) => {
  getUser.then( user => {
    // check if going to signin page and call next() to proceed
    if (to.name === 'signin') {
      next()
    } else {
      // check if the user is logged is not logged in
      if (!store.state.user) {
        next({ name: 'signin' })
      } else {
        next()
      }
    }
  })
})

export default router