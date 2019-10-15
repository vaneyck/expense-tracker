import firebaseAPI from 'firebase'
import * as firebaseui from "firebaseui"
require('firebase/firestore')

const config = {
  apiKey: "AIzaSyC6c2gfMTNF-1gEbnXh8CvnXx8HTl7Deps",
  authDomain: "expense-tracker-ac6d8.firebaseapp.com",
  databaseURL: "https://expense-tracker-ac6d8.firebaseio.com",
  projectId: "expense-tracker-ac6d8",
  storageBucket: "expense-tracker-ac6d8.appspot.com",
  messagingSenderId: "211067149885",
  appId: "1:211067149885:web:ebd906e225aba5a4"
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

// Firebase messaging
const messagingApi = firebaseAPI.messaging();
messagingApi.usePublicVapidKey("BPcBcrqojNuTKM2Ar1aZU9rr31X2nctN0e_ccCgYfSNQlwVTPJEC7eRDAYhQJ2kPjVdeMb1BR0A2WC9A6grej08");

Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.log('Unable to get permission to notify.');
  }
});

messagingApi.getToken().then((currentToken) => {
  if (currentToken) {
    console.log("Current Token")
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});

// Callback fired if Instance ID token is updated.
messagingApi.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    console.log('Token refreshed.', refreshedToken);
    // ...
  }).catch((err) => {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

export const firebase = firebaseAPI
export const signInUi = ui
export const firestore = firestoreDatabase
export const messaging = messagingApi
