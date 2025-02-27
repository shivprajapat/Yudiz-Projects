const admin = require('firebase-admin')
const config = require('./../config/config')
const axios = require('axios')
const { IOS_APP_STORE_ID, IOS_CUSTOM_SCHEME, IOS_BUNDLE_ID, DYNAMIC_LINK_ANDROID_PACKAGE_NAME, DYNAMIC_LINK_DOMAIN_URI_PREFIX, SHARE_SOCIAL_TITLE, SHARE_SOCIAL_DESCRIPTION, PRIVATE_CONTEST_SOCIAL_TITLE, PRIVATE_CONTEST_SOCIAL_DESCRIPTION } = require('./../config/common')
// const FIREBASE_PRIVATE_KEY = require('../helper/third-party-cred/fantasy-2ba35-firebase-adminsdk-ks7yx-027840e520.json')
const { chunk } = require('../helper/utilities.services')
// admin.initializeApp({ credential: admin.credential.cert(FIREBASE_PRIVATE_KEY) })
const FIREBASE_PRIVATE_KEY = require('../helper/third-party-cred/firebase-sdk.json')
admin.initializeApp({ credential: admin.credential.cert(FIREBASE_PRIVATE_KEY) })

const adminMessage = admin.messaging()

const subscribeUser = async (sPushToken, ePlatform) => {
  await adminMessage.subscribeToTopic(sPushToken, 'All')
  if (ePlatform === 'A') {
    return adminMessage.subscribeToTopic(sPushToken, 'Android')
  } else if (ePlatform === 'I') {
    return adminMessage.subscribeToTopic(sPushToken, 'IOS')
  } else if (ePlatform === 'W') {
    return adminMessage.subscribeToTopic(sPushToken, 'Web')
  }
}

const pushTopicNotification = async (topic, title, body) => {
  if (config.APP_ENV !== 'production') return
  const message = {
    notification: {
      title,
      body
    },
    topic,
    data: {
      title,
      message: body,
      isScheduled: 'true'
    }
  }
  return adminMessage.send(message)
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

const genDynamicLinkV2 = (sType, sCode, sportsType, id) => {
  return new Promise((resolve, reject) => {
    let socialMetaTagInfo
    let link
    if (!config.DEEP_LINK_ENABLE) {
      link = ''
      return resolve(link)
    }
    if (sType === 'share') {
      socialMetaTagInfo = { socialTitle: SHARE_SOCIAL_TITLE, socialDescription: SHARE_SOCIAL_DESCRIPTION /* socialImageLink: 'https://housieskill-media.s3.ap-south-1.amazonaws.com/housie_ball.png' */ }
      link = `${config.FRONTEND_HOST_URL}/sign-up?shareCode=${sCode}`
    } else {
      socialMetaTagInfo = { socialTitle: PRIVATE_CONTEST_SOCIAL_TITLE, socialDescription: PRIVATE_CONTEST_SOCIAL_DESCRIPTION /* socialImageLink: 'https://housieskill-media.s3.ap-south-1.amazonaws.com/housie_ball.png' */ }
      link = `${config.FRONTEND_HOST_URL}/join-contest?sportsType=${sportsType}&matchId=${id}&code=${sCode}`
    }

    axios.post(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${config.FIREBASE_WEB_API_KEY}`,
      {
        dynamicLinkInfo: {
          domainUriPrefix: DYNAMIC_LINK_DOMAIN_URI_PREFIX,
          link,
          androidInfo: { androidPackageName: DYNAMIC_LINK_ANDROID_PACKAGE_NAME, androidFallbackLink: config.FRONTEND_HOST_URL },
          iosInfo: { iosBundleId: IOS_BUNDLE_ID, iosCustomScheme: IOS_CUSTOM_SCHEME, iosAppStoreId: IOS_APP_STORE_ID },
          navigationInfo: { enableForcedRedirect: true },
          socialMetaTagInfo
        },
        suffix: { option: 'SHORT' }
      },
      { headers: { 'Content-Type': 'application/json' } }
    ).then(dynamicLink => {
      const shortLink = dynamicLink.data.shortLink
      resolve(shortLink)
    }).catch(error => {
      reject(error)
    })
  })
}

const sendAll = async (messages, size = 500) => {
  try {
    const messagesChunk = chunk(messages, size)

    for (const message of messagesChunk) {
      await adminMessage.sendAll(message)
    }
    return true
  } catch (error) {
    throw Error(error)
  }
}

const sendMultiCast = async (messages) => {
  try {
    for (const message of messages) {
      await adminMessage.sendMulticast(message)
    }
    return true
  } catch (error) {
    throw Error(error)
  }
}

const sendMultiCastNotification = async(tokens, title, body, sPushType = 'HOME') => {
  try {
    let isSuccess = false
    const message = {
      notification: {
        title,
        body
      },
      data: {
        title,
        body,
        sPushType
      },
      tokens
    }
    const data = await adminMessage.sendMulticast(message)

    if (data.failureCount) {
      const failedTokens = []
      data.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx])
        }
      })
      console.log('List of tokens that caused failures: ' + failedTokens)
    }
    if (data.successCount) isSuccess = true
    return isSuccess
  } catch (error) {
    throw Error(error)
  }
}

const unsubscribeUsers = async (sPushToken) => {
  try {
    if (!Array.isArray(sPushToken)) {
      sPushToken = [sPushToken]
    }

    if (sPushToken.length > 0) {
      await Promise.all([
        adminMessage.unsubscribeFromTopic(sPushToken, 'All'),
        adminMessage.unsubscribeFromTopic(sPushToken, 'Web'),
        adminMessage.unsubscribeFromTopic(sPushToken, 'IOS'),
        adminMessage.unsubscribeFromTopic(sPushToken, 'Android')
      ])
    }
    return
  } catch (error) {
    throw Error(error)
  }
}

module.exports = {
  subscribeUser,
  pushTopicNotification,
  pushNotification,
  sendAll,
  sendMultiCast,
  genDynamicLinkV2,
  sendMultiCastNotification,
  unsubscribeUsers
}
