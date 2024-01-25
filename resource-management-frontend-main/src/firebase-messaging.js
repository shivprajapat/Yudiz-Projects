// import { initializeApp } from 'firebase/app'

// import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// const firebaseApp = initializeApp({
//   apiKey: 'AIzaSyCcKg1GXxjdd9xEhygERddeumagnSrpze4',
//   authDomain: 'push-notification-b7411.firebaseapp.com',
//   projectId: 'push-notification-b7411',
//   storageBucket: 'push-notification-b7411.appspot.com',
//   messagingSenderId: '670156164135',
//   appId: '1:670156164135:web:2342c5b22ddab2d86c9202',
//   measurementId: 'G-9P2JY9Q9YE',
// })

// try {
//   const messaging = getMessaging(firebaseApp)

//   onMessage(messaging, (payload) => {
//     console.log('[firebase-messaging.js] Received foreground message ', payload)

//     if (!(self.Notification && self.Notification.permission === 'granted')) {
//       return
//     }

//     Notification?.requestPermission()
//       .then((permission) => {
//         if (permission === 'granted') {
//           var notify = new Notification(payload.notification.title, {
//             body: payload.notification.body,
//             icon: '/logo.svg',
//             badge: '/logo.svg',
//             tag: new Date().toISOString(),
//           })
//           notify.onclick = function (a) {
//             a.target.close()
//           }
//           setTimeout(() => {
//             notify.close()
//           }, 4000)
//         }
//       })
//       .catch((err) => console.log({ err }))
//   })

//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('/firebase-messaging-sw.js', { type: 'module' })
//       .then((registration) => {
//         console.log('😎')

//         getToken(messaging, {
//           vapidKey: 'BIFxFFcNHe6Lomykd-HaDTRJMDhpNFWl-dv1dwVvRZrfFUkVFF5Sx52qZdH54TkyeJedhvDEb3eVqb2Cx_LXzj4',
//           serviceWorkerRegistration: registration,
//         })
//           .then(function (token) {
//             console.log(token)
//           })
//           .catch(function (err) {
//             console.error("Didn't get notification permission", err)
//           })
//       })
//       .catch((error) => {
//         console.error('😥', error)
//       })
//   }
// } catch (error) {
//   console.log(error)
// }
