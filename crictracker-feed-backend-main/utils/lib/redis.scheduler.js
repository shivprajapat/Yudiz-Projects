const postmark = require('postmark')
const { redisFeedDb } = require('./../lib/redis')
const { POSTMARK_SERVER_CLIENT, SMTP_FROM, SMTP_PRODUCT_NAME, SMTP_PRODUCT_URL, SMTP_SUPPORT_EMAIL, FEED_BASE_URL } = require('../../config')
const postmarkClient = new postmark.ServerClient(POSTMARK_SERVER_CLIENT)

const queuePush = (queueName, data) => {
  return redisFeedDb.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisFeedDb.lpop(queueName)
}

const sendMailPostMark = async () => {
  try {
    let data = await queuePop('sendMail')

    if (!data) {
      setTimeout(() => sendMailPostMark(), 7000)
      return
    }

    data = JSON.parse(data)
    const dataObj = {
      From: SMTP_FROM,
      To: data.sEmail,
      TemplateModel: {
        product_url: SMTP_PRODUCT_URL,
        product_name: SMTP_PRODUCT_NAME,
        otp: data.sOtp,
        support_email: SMTP_SUPPORT_EMAIL
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
      case 'feedPasswordReset':
        dataObj.TemplateAlias = 'feed-password-reset'
        dataObj.TemplateModel.name = data?.sUserName || 'mate'
        dataObj.TemplateModel.action_url = `${FEED_BASE_URL}/reset-password?t=${data.sVerificationToken}`
        break
      default:
        return sendMailPostMark()
    }

    postmarkClient.sendEmailWithTemplate(dataObj)
    return sendMailPostMark()
  } catch (error) {
    console.log(error)
    return setTimeout(() => sendMailPostMark(), 2000)
  }
}

setTimeout(() => {
  sendMailPostMark()
}, 2000)

module.exports = { queuePush }
