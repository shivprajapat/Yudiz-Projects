// @ts-check
const nodemailer = require('nodemailer')
const config = require('../config/config')
const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER)
const { validateEmail, handleCatchError } = require('./utilities.services')
const sendMail = async ({ to, attachments, subject, emailBody }) => {
  try {
    const nodeMailerOptions = {
      from: `${config.SMTP_FROM}`,
      to,
      subject,
      html: emailBody
    }
    if (Array.isArray(attachments) && attachments.length)nodeMailerOptions.attachments = attachments
    const bEmail = await validateEmail(to)
    if (to && bEmail) {
      return await transporter.sendMail(nodeMailerOptions)
    }
    return
  } catch (error) {
    handleCatchError(error)
  }
}
module.exports = {
  sendMail
}
