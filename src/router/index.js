import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Caesh from '@/views/Caesh'
import LandingPage from '@/views/LandingPage'
import SignIn from '@/components/SignIn'
import Expense from '@/views/Expense';
import ViewExpense from '@/views/ViewExpense';
import ViewCategoryExpenses from '@/views/ViewCategoryExpenses';
import Settings from '@/components/Settings'
import { store } from '@/store'
import { firebase } from '@/firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/home/:monthToViewParam',
      name: 'monthView',
      component: Home,
      props: true
    },
    {
      path: '/caesh',
      name: 'caesh',
      component: Caesh,
      props: true
    },
    {
      path: '/expense/:expenseId',
      name: 'expenseEdit',
      component: Expense,
      props: true
    },
    {
      path: '/expenseview/:expenseId',
      name: 'expenseView',
      component: ViewExpense,
      props: true
    },
    {
      path: '/expense',
      name: 'expenseCreate',
      component: Expense,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      props: true
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage
    },
    {
      path: '/category/:categoryId',
      name: 'categoryView',
      component: ViewCategoryExpenses,
      props: true
    }
  ]
})
var getUser = function () {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      //console.log("getUser: Waiting for user", user)
      if (user) {
        store.dispatch('updateUser', user)
        resolve(user)
      } else {
        reject("User Not Available")
      }
    })
  })
}

var getUserToken = function () {
  return new Promise((resolve, reject) => {
    firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      resolve(idToken);
    }).catch(function(error) {
      reject("Could not get ID Token", error);
    });
  })
}
/**
 * Redirect to the sign in page if user is not logged in
 */
router.beforeEach(async function (to, from, next) {
  // check if going to signin page and call next() to proceed
  if (to.name === 'landingpage') {
    console.log("ROUTER: going to caesh")
    next()
  } else if (to.name === 'signin') {
    console.log("ROUTER: going to signin")
    next()
  } else {
    try {
      console.log("ROUTER:", new Date(), "getting user")
      let user = await getUser();
      let token = await getUserToken();
      store.dispatch('updateToken', token);
      console.log("ROUTER:", new Date(), "got user")
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