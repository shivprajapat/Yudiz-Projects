import {
  getMessaging,
  getToken
} from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging.js'

const admin = require('firebase-admin')
// const firebase = require('firebase-admin')

const serviceAccount = require('./resource-management-f8560-97a2b372eb19.json')
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://resource-management-f8560.firebaseio.com'
})
const messaging = getMessaging(app)
function requestPermission() {
  console.log('Requesting permission...')
  try {
    // eslint-disable-next-line no-undef
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.')
      }
    })
  } catch (error) {
    return console.log(error.message)
  }
}
requestPermission()

getToken(messaging, {
  vapidKey:
    'BIQukEkKfAHq7J3StAJO7k7kmE1p-Yve8VMwq9JpD3z5Lzo1PpOyryoUy_8AbCSZ-HqHih2qddr_Mjd62d-AeHY'
})
  .then((token) => {
    console.log('token = ' + token)
  })
  .catch((err) => console.log('Error is: ', err.message))

function sendNotification(heading, body, token) {
  const message = {
    notification: {
      title: heading,
      body
    },
    token
  }
  admin.messaging().send(message).then((response) => {
    console.log('Notification send message:', response)
  }).catch((error) => {
    console.log(error)
  })
}

// not in work

module.exports = { sendNotification }
