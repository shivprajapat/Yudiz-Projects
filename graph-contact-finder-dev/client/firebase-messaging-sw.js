/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js')
importScripts(
  'https://www.gstatic.com/firebasejs/7.20.0/firebase-messaging.js'
)
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
  'https://www.gstatic.com/firebasejs/8.4.3/firebase-analytics.js'
)
firebase.initializeApp({
  apiKey: 'AIzaSyBW3tYWM9tdzsy6selO0r2bfsxBPY97WDQ',
  authDomain: 'relationproject-85e38.firebaseapp.com',
  projectId: 'relationproject-85e38',
  storageBucket: 'relationproject-85e38.appspot.com',
  messagingSenderId: '914310669187',
  appId: '1:914310669187:web:614027f86ffc0c47c60cb6',
  measurementId: 'G-466BM7WZ1B'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  }

  self.registration.showNotification(notificationTitle,
    notificationOptions)
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  return event
})
