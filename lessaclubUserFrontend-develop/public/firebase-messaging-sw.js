// uncomment for firebase push notification
// Scripts for firebase and firebase messaging

importScripts('https://www.gstatic.com/firebasejs/9.9.3/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing the generated config
// Not able to use env variables hee, hence used direct values here
// update firebaseConfig as per firebase project

const firebaseConfig = {
  apiKey: 'AIzaSyBqA5CoxwEgrp4ckKWJZEqUI108DHa3GcQ',
  authDomain: 'nuuway1.firebaseapp.com',
  projectId: 'nuuway1',
  storageBucket: 'nuuway1.appspot.com',
  messagingSenderId: '22082829726',
  appId: '1:22082829726:web:68e2c6dfe597779c12ea8f',
  measurementId: 'G-H9CFHYHPE4'
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)
})
messaging.onMessage(function (payload) {
  console.log('Received foreground message ', payload)
})
