const { queuePop, queuePush, bulkQueuePop } = require('../../helper/redis')
const UserModel = require('../user/model')
const { pushNotification, pushTopicNotification } = require('../../helper/firebase.services')
const { sendMail } = require('../../helper/email.service')
const { sendOTPFromProvider } = require('../../helper/sms.services')
const { handleCatchError } = require('../../helper/utilities.services')
const { messages } = require('../../helper/api.responses')
const { APP_LANG } = require('../../config/common')
const { sendMultiCastNotification } = require('../../helper/firebase.services')

async function pushPlayReturnNotify() {
  let data
  try {
    data = await bulkQueuePop('pushNotification:playReturn', 500)
    if (!data) {
      setTimeout(() => { pushPlayReturnNotify() }, 2000)
      return
    }
    data = data.map(d => JSON.parse(d))

    const user = await UserModel.find({ _id: { $in: data }, 'aPushToken.sPushToken': { $exists: true } }, { 'aPushToken.sPushToken': 1, _id: 0 }).lean()
    const pushtokens = new Set()

    for (let i = 0; i < user.length; i++) {
      const tokens = user[i].aPushToken
      pushtokens.add(...tokens)
    }
    const sPushTokens = [...pushtokens].map(pushtoken => pushtoken.sPushToken)

    if (sPushTokens.length) {
      await sendMultiCastNotifications(sPushTokens, 'Play Return', 'Your Play return paid successfully')
    }
    pushPlayReturnNotify()
  } catch (error) {
    await queuePush('dead:pushNotification:playReturn', data)
    handleCatchError(error)
    pushPlayReturnNotify()
  }
}

async function referCodeBonusNotify() {
  let data
  try {
    data = await queuePop('pushNotification:referCodeBonus')
    if (!data) {
      setTimeout(() => { referCodeBonusNotify() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { _id } = data
    const user = await UserModel.findById(_id, { aPushToken: 1 }).lean()
    if (user && user.aPushToken) {
      const tokens = user.aPushToken
      await sendNotification(tokens, 'Refer Code Bonus', 'You\'ve Got Refer Code Bonus successfully')
    }
    referCodeBonusNotify()
  } catch (error) {
    await queuePush('dead:pushNotification:referCodeBonus', data)
    handleCatchError(error)
    referCodeBonusNotify()
  }
}

async function registerBonusNotify() {
  let data
  try {
    data = await queuePop('pushNotification:registerBonus')
    if (!data) {
      setTimeout(() => { registerBonusNotify() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { _id } = data
    const user = await UserModel.findById(_id, { aPushToken: 1 }).lean()
    if (user && user.aPushToken) {
      const tokens = user.aPushToken
      await sendNotification(tokens, 'Register Bonus', 'You\'ve Got Register Bonus successfully')
    }

    registerBonusNotify()
  } catch (error) {
    await queuePush('dead:pushNotification:registerBonus', data)
    handleCatchError(error)
    registerBonusNotify()
  }
}

async function registerReferNotifify() {
  let data
  try {
    data = await queuePop('pushNotification:registerReferBonus')
    if (!data) {
      setTimeout(() => { registerReferNotifify() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { _id } = data
    const user = await UserModel.findById(_id, { aPushToken: 1 }).lean()
    if (user && user.aPushToken) {
      const tokens = user.aPushToken
      await sendNotification(tokens, 'Register Refer Bonus', 'You\'ve Got Register Refer Bonus successfully')
    }
    registerReferNotifify()
  } catch (error) {
    await queuePush('dead:pushNotification:registerReferBonus', data)
    handleCatchError(error)
    registerReferNotifify()
  }
}

async function withdrawRejectNotify() {
  let data
  try {
    data = await queuePop('pushNotification:rejectWithdraw')
    if (!data) {
      setTimeout(() => { withdrawRejectNotify() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { _id, sRejectReason } = data
    const user = await UserModel.findById(_id, { aPushToken: 1 }).lean()
    if (user?.aPushToken) {
      const tokens = user.aPushToken
      await sendNotification(tokens, messages[APP_LANG].withdraw_rejected, messages[APP_LANG].withdraw_rejected_reason.replace('##', sRejectReason))
    }
    withdrawRejectNotify()
  } catch (error) {
    await queuePush('dead:pushNotification:rejectWithdraw', data)
    handleCatchError(error)
    withdrawRejectNotify()
  }
}

async function sendSms() {
  let data
  try {
    data = await queuePop('sendSms')
    if (!data) {
      setTimeout(() => { sendSms() }, 2000)
      return
    }
    data = JSON.parse(data)
    // need to add code here
    const { sProvider, oUser } = data
    await sendOTPFromProvider(sProvider, oUser)
    sendSms()
  } catch (error) {
    await queuePush('dead:sendSms', data)
    handleCatchError(error)
    sendSms()
  }
}

async function sendMails() {
  let data
  try {
    data = await queuePop('SendMail')
    if (!data) {
      setTimeout(() => { sendMails() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { sSlug, replaceData, to } = data

    await sendMail({ sSlug: sSlug, replaceData: replaceData, to: to })
    sendMails()
  } catch (error) {
    await queuePush('dead:SendMail', data)
    handleCatchError(error)
    sendMails()
  }
}

async function sendNotification(tokens, title, body) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const [token] = tokens.slice(-1)
        if (token && token.sPushToken) {
          await pushNotification(token.sPushToken, title, body)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function notificationScheduler() {
  let data
  try {
    data = await queuePop('NOTIFY')
    if (!data) {
      setTimeout(() => { notificationScheduler() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { sTopic, sTitle, sMessage } = data
    await pushTopicNotification(sTopic, sTitle, sMessage)
    notificationScheduler()
  } catch (error) {
    await queuePush('dead:NOTIFY', data)
    handleCatchError(error)
    notificationScheduler()
  }
}

async function birthdayBonusNotification() {
  let data
  try {
    data = await bulkQueuePop('pushNotification:BirthdayBonus', 500)
    if (!data?.length) {
      setTimeout(() => { birthdayBonusNotification() }, 2000)
      return
    }
    data = data.map(d => JSON.parse(d))
    const bonus = data[0].bonus
    const aUserIds = data.map(user => user?._id)
    const user = await UserModel.find({ _id: { $in: aUserIds }, 'aPushToken.sPushToken': { $exists: true } }, { aPushToken: 1, _id: 0 }).lean()
    const pushtokens = new Set()
    for (let i = 0; i < user.length; i++) {
      for (const pushtoken of user[i].aPushToken) {
        if (pushtoken?.sPushToken) pushtokens.add(pushtoken.sPushToken)
      }
    }
    if (pushtokens.size) {
      await sendMultiCastNotifications([...pushtokens], 'Birthday Bonus', `You have Got Birthday Bonus of ${bonus} successfully`)
    }
    birthdayBonusNotification()
  } catch (error) {
    await queuePush('dead:pushNotification:BirthdayBonus', data)
    handleCatchError(error)
    birthdayBonusNotification()
  }
}

// this is an internally used function
async function sendMultiCastNotifications(tokens, title, body) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await sendMultiCastNotification(tokens, title, body)
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

module.exports = {
  pushPlayReturnNotify,
  referCodeBonusNotify,
  registerBonusNotify,
  registerReferNotifify,
  withdrawRejectNotify,
  sendSms,
  sendMails,
  notificationScheduler,
  sendNotification,
  birthdayBonusNotification
}
