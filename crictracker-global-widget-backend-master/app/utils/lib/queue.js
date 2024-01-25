const { words } = require('./data')
const { redisclient, redisArticleDb } = require('../../utils/lib/redis')
const { mailService, mailTemplates } = require('../../utils/lib/mailService')
const Filter = require('bad-words')
const { PollModel } = require('../../model')
const { ObjectId } = require('mongoose').Types

const sanitize = new Filter()
const moment = require('moment')

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

const updatePollStatus = async () => {
  try {
    const data = await redisArticleDb.lpop('pollstatus')

    if (data) {
      const parsedData = JSON.parse(data)

      const poll = await PollModel.findOne({ _id: parsedData._id })

      if (parsedData?.nStartTimeStamp === moment(poll?.dStartDate).utc().unix()) PollModel.updateOne({ _id: ObjectId(parsedData._id) }, { $set: { eStatus: 'pub' } }).then()
      else if (parsedData?.nEndTimeStamp === moment(poll?.dEndDate).utc().unix()) PollModel.updateOne({ _id: ObjectId(parsedData._id) }, { $set: { eStatus: 'ex' } }).then()

      return updatePollStatus()
    } else {
      setTimeout(() => updatePollStatus(), 20000)
    }
  } catch (error) {
    console.log({ error })
    updatePollStatus()
  }
}

setTimeout(() => {
  sendMail()
  updatePollStatus()
}, 2000)

module.exports = { queuePush }
