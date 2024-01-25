const nodemailer = require('nodemailer')
const fs = require('fs')
const ejs = require('ejs')
const config = require('../config/config')
const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER)
const { replaceText, validateEmail } = require('./utilities.services')
const { findEmailTemplate } = require('../middlewares/grpc/clientServices')
const { handleCatchError } = require('./utilities.services')

const sendMail = async ({ sSlug, replaceData, to }) => {
  try {
    const emailTemplate = await findEmailTemplate({ sSlug: sSlug })

    if (!emailTemplate) {
      throw Error('template not found from the database')
    }

    const sContent = emailTemplate.sContent
    const content = replaceText(sContent, replaceData)

    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'basic.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })

    const emailBody = ejs.render(template, { content })

    const nodeMailerOptions = {
      from: `${config.CLIENT_NAME} ${config.SMTP_FROM}`,
      to: to,
      subject: emailTemplate.sSubject,
      html: emailBody
    }

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
