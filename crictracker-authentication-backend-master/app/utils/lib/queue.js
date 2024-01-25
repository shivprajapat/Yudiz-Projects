const postmark = require('postmark')
const { users } = require('../../model')
const { redisMailDb, redisclient } = require('./redis')
// const { mailService, mailTemplates } = require('./mailService')
const { POSTMARK_SERVER_CLIENT } = require('../../../config')

const postmarkClient = new postmark.ServerClient(POSTMARK_SERVER_CLIENT)

const queuePush = (queueName, data) => {
  return redisMailDb.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisMailDb.lpop(queueName)
}
const clientQueuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}
// const sendMail = async () => {
//   try {
//     let data = await queuePop('sendMail')
//     if (!data) {
//       setTimeout(() => sendMail(), 7000)
//       return
//     }

//     data = JSON.parse(data)
//     let mailTemplate
//     let dataObj
//     switch (data.eType) {
//       case 'forgetPassword':
//         mailTemplate = mailTemplates.forgotPassword
//         dataObj = { sEmail: data.sEmail, sOtp: data.sOtp }
//         break
//       case 'loginCredentials':
//         mailTemplate = mailTemplates.loginCredentials
//         dataObj = { sEmail: data.sEmail, sUserName: data.sUserName, sPassword: data.sPassword }
//         break
//       default:
//         return
//     }
//     await mailService.send(mailTemplate, dataObj)
//     sendMail()
//   } catch (error) {
//     console.log(error)
//   }
// }

const sendMailPostMark = async () => {
  try {
    let data = await queuePop('sendMail')

    if (!data) {
      setTimeout(() => sendMailPostMark(), 7000)
      return
    }

    data = JSON.parse(data)
    const dataObj = {
      From: 'CricTracker support@crictracker.com',
      To: data.sEmail,
      TemplateModel: {
        product_url: 'https://www.crictracker.com/',
        product_name: 'CricTracker',
        otp: data.sOtp,
        support_email: 'support@crictracker.com'
      }
    }

    switch (data.eType) {
      case 'r':
        dataObj.TemplateAlias = 'registration'
        break
      case 'f':
        dataObj.TemplateAlias = 'password-reset'
        break
      case 'loginCredentials':
        dataObj.TemplateAlias = 'user-invitation-admin'
        dataObj.TemplateModel.name = data?.sUserName || 'mate'
        dataObj.TemplateModel.invite_sender_name = 'Sai Kishore'
        dataObj.TemplateModel.invite_sender_organization_name = 'CricTracker'
        dataObj.TemplateModel.action_url = 'https://admin.crictracker.com/dashboard/profile/'
        dataObj.TemplateModel.login_email = data?.sEmail
        dataObj.TemplateModel.password = data?.sPassword || 'Error in password generation'
        break
      case 'deleteUser':
        dataObj.TemplateAlias = 'account-delete-user'
        dataObj.TemplateModel.name = data?.sUserName || 'mate'
        dataObj.TemplateModel.support_url = 'mailto:support@crictracker.com'
        dataObj.TemplateModel.feedback_url = 'https://www.crictracker.com/feedback/'
        break
      default:
        return sendMailPostMark()
    }

    postmarkClient.sendEmailWithTemplate(dataObj)
    return sendMailPostMark()
  } catch (error) {
    console.log(error)
    return sendMailPostMark()
  }
}

const updateBookmarkCount = async () => {
  try {
    const allBookmarksKeys = await redisclient.keys('bookmark_count:*')
    if (!allBookmarksKeys?.length) {
      setTimeout(() => updateBookmarkCount(), 7000)
      return
    }

    for await (const keys of allBookmarksKeys) {
      let data = await redisclient.get(keys)
      data = JSON.parse(data)
      if (data?.iUserId) {
        await users.updateOne({ _id: data.iUserId }, { nBookmarkCount: data?.nTotal })
        await redisclient.del(`bookmark_count:${data.iUserId}`)
        setTimeout(() => updateBookmarkCount(), 2000)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

setTimeout(() => {
  // sendMail()
  sendMailPostMark()
  updateBookmarkCount()
}, 2000)

module.exports = { queuePush, clientQueuePush }
