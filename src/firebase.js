import firebaseAPI from 'firebase'
import firebaseUi from 'firebaseui'
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

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseUi.auth.AuthUI(firebaseAPI.auth())

// Firestore config
var firestoreDatabase = firebaseAPI.firestore()
const settings = {
  timestampsInSnapshots: true
}
firestoreDatabase.settings(settings)

export const firebase = firebaseAPI
export const signInUi = ui
export const firestore = firestoreDatabase
