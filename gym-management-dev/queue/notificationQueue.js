const { QUEUE_CONFIG } = require('../config/development')
const { queuePop, queuePush } = require('../database/redis')
const { sendMail } = require('../helper/email.service')
const { handleCatchError } = require('../helper/utilities.services')

async function sendQueuedMails () {
  let data
  try {
    data = await queuePop(QUEUE_CONFIG?.EMAIL_QUEUE)
    if (!data) {
      setTimeout(() => { sendQueuedMails() }, 2000)
      return
    }
    data = JSON.parse(data)
    const { to, attachments, emailBody, subject } = data
    await sendMail({ to, attachments, emailBody, subject })
    sendQueuedMails()
  } catch (error) {
    await queuePush(QUEUE_CONFIG?.DEAD_EMAIL_QUEUE, data)
    handleCatchError(error)
    sendQueuedMails()
  }
}

module.exports = { sendQueuedMails }
