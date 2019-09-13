import firebaseAPI from 'firebase'
import * as firebaseui from "firebaseui"
require('firebase/firestore')

var config = {
  apiKey: "AIzaSyC6c2gfMTNF-1gEbnXh8CvnXx8HTl7Deps",
  authDomain: "expense-tracker-ac6d8.firebaseapp.com",
  databaseURL: "https://expense-tracker-ac6d8.firebaseio.com",
  projectId: "expense-tracker-ac6d8",
  storageBucket: "expense-tracker-ac6d8.appspot.com",
  messagingSenderId: "211067149885"
};

// Initiailize the firebase App
firebaseAPI.initializeApp(config)

// Initialize the firebaseui Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebaseAPI.auth())

// Firestore config
var firestoreDatabase = firebaseAPI.firestore();
const settings = {}
firestoreDatabase.settings(settings)

firestoreDatabase.enablePersistence()
  .then(function () {
    // console.log("Persistence Enabled")
  })
  .catch(function (err) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.error("offline storage can't function when two tabs are open")
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.error("offline storage not supported")
    }
  });

export const firebase = firebaseAPI
export const signInUi = ui
export const firestore = firestoreDatabase
