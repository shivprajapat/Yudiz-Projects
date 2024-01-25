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
  apiKey: 'AIzaSyBbVb54ZxgNwG-c3ImBDBRS2OZrlVO_23s',
  authDomain: 'fantasy-wl.firebaseapp.com',
  projectId: 'fantasy-wl',
  storageBucket: 'fantasy-wl.appspot.com',
  messagingSenderId: '218538323308',
  appId: '1:218538323308:web:5b819e7bb91e6c58db9749',
  measurementId: 'G-ZL9TZ6RPRL'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    data: payload?.data,
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  const payload = event?.notification?.data
  const sPushType = event?.notification?.data?.sPushType
  let redirectUrl = ''

  switch (sPushType) {
    case 'lineup_alerts':
      redirectUrl = `/upcoming-match/leagues/${(payload?.matchCategory).toLowerCase()}/${payload?.iMatchId}`
      break
    case 'winner_announcement':
      redirectUrl = `/live-completed-match/league-details/${(payload?.matchCategory).toLowerCase()}/${payload?.iMatchId}/${payload?.sLeagueId}`
      break
    case 'match_available':
      redirectUrl = ''
      break
    case 'match_cancel':
      redirectUrl = `/completed-match/leagues/${(payload?.matchCategory).toLowerCase()}/${payload?.iMatchId}`
      break
    case 'match_start':
      redirectUrl = `/upcoming-match/leagues/${(payload?.matchCategory).toLowerCase()}/${payload?.iMatchId}`
      break
    case 'bonus_added':
      redirectUrl = '/transactions'
      break
    case 'bonus_expire':
      redirectUrl = '/transactions'
      break
    case 'play_return':
      redirectUrl = '/transactions'
      break
    case 'cashback':
      redirectUrl = '/transactions'
      break
    case 'promotions':
      redirectUrl = ''
      break
    case 'kyc_rejected':
      redirectUrl = '/kyc-verification'
      break
    case 'kyc_approved':
      redirectUrl = '/kyc-verification'
      break
    case 'referral':
      redirectUrl = '/refer-a-friend'
      break
    case 'withdrawal':
      redirectUrl = '/transactions'
      break
    default:
      redirectUrl = ''
      break
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if the URL is already opened in any existing window
      for (const client of clientList) {
        if (client) {
          // If the URL is already opened, focus on the existing window instead of opening a new one - Not working
          return client.navigate(self.location.origin + redirectUrl)
        }
      }
      // If the URL is not opened in any existing window, open it in a new window
      return clients.openWindow(self.location.origin + redirectUrl)
    })
  )
  event.notification.close()
})
