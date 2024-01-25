const { words } = require('./data')
const { redisclient } = require('../../utils/lib/redis')
const { mailService, mailTemplates } = require('../../utils/lib/mailService')
const Filter = require('bad-words')
const sanitize = new Filter()
if (words.length) sanitize.addWords(...words)

const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisclient.lpop(queueName)
}

const sendMail = async () => {
  try {
    let data = await queuePop('sendMail')
    if (!data) {
      setTimeout(() => sendMail(), 20000)
      return
    }

    data = JSON.parse(data)
    let mailTemplate
    let dataObj
    switch (data.eType) {
      case 'forgetPassword':
        mailTemplate = mailTemplates.forgotPassword
        dataObj = { sEmail: data.sEmail, sOtp: data.sOtp }
        break
      case 'loginCredentials':
        mailTemplate = mailTemplates.loginCredentials
        dataObj = { sEmail: data.sEmail, sUsername: data.sUsername, sPassword: data.sPassword }
        break
      case 'feedback':
        mailTemplate = mailTemplates.feedbackEmail
        dataObj = { sName: data.sName, sPhone: data.sPhone, quryTypeLable: data.quryTypeLable, sSubject: data.sSubject, sPageLink: data.sPageLink, sMessage: data.sMessage }
        break
      case 'contact':
        mailTemplate = mailTemplates.contactEmail
        dataObj = { sName: data.sName, sPhone: data.sPhone, quryTypeLable: data.quryTypeLable, sSubject: data.sSubject, sCompany: data.sCompany, sCity: data.sCity, sMessage: data.sMessage }
        break
      default:
        return
    }
    await mailService.send(mailTemplate, dataObj)
    sendMail()
  } catch (error) {
    console.log(error)
  }
}

setTimeout(() => {
  sendMail()
}, 2000)

module.exports = { queuePush }
