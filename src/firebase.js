import firebaseAPI from 'firebase'
import firebaseUi from 'firebaseui'
require('firebase/firestore')
import { config } from '@/firebase-config'

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
