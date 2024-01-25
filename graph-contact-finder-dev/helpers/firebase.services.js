const firebase = require('firebase-admin')
const FIREBASE_PRIVATE_KEY = require('./third-party/firebase-admin-sdk.json')
firebase.initializeApp({ credential: firebase.credential.cert(FIREBASE_PRIVATE_KEY) })

const adminMessage = firebase.messaging()

const subscribeUser = async (sPushToken, sTopic) => {
  await adminMessage.subscribeToTopic(sPushToken, sTopic)
}

const pushTopicNotification = async (topic, title, body) => {
  const message = {
    notification: {
      title,
      body
    },
    data: {
      title,
      message: body,
      isScheduled: 'true'
    }
  }
  return adminMessage.sendToTopic(topic, message)
}

const pushNotification = async (subscribedToken, title, body) => {
  const message = {
    token: subscribedToken,
    notification: {
      title,
      body
    },
    webpush: {
      headers: {
        Urgency: 'high'
      },
      notification: {
        body,
        requireInteraction: 'true'
      }
    }
  }
  return adminMessage.send(message)
}

module.exports = {
  pushNotification,
  pushTopicNotification,
  subscribeUser
}
