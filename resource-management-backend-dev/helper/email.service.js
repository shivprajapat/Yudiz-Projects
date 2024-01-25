const nodemailer = require('nodemailer')
const config = require('../config/config')
const ejs = require('ejs')
const RuntimeCredential = require('../models_routes_service/organizationDetail/runtimecredential.model')
const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER)
const organizationDetailModel = require('../models_routes_service/organizationDetail/model')

require('dotenv').config()
const path = require('path')
const fs = require('fs')

const getTemplate = (filename, body) => {
  const emailTemplatePath = path.join(
    __dirname,
    '../view',
    filename
  )
  const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })
  return ejs.render(template, body)
}

async function sendEmail(body) {
  const data = await organizationDetailModel.findOne({
    eStatus: 'Y'
  }, {
    sName: 1,
    sLogo: 1,
    sUrl: 1,
    sOrganizationUrl: 1
  })
  // console.log(body)
  let filename = ''
  let subject = ''
  if (body.type === 'Reset-Password') {
    filename = 'forgotPassword.ejs'
    subject = 'Forgot Password Mail'
  }
  if (body.type === 'Excel-Data') {
    filename = 'excel.ejs'
    subject = 'Excel-data'
  }
  if (body.type === 'Set-Password') {
    filename = 'setPassword.ejs'
    subject = 'Set Password Mail'
  }

  // console.log('filename', filename)
  // console.log('data', data)
  const template = getTemplate(filename, { ...body, ORGNAME: data.sName, sLogo: data.sUrl, sOrganizationUrl: data.sOrganizationUrl })
  // if(config.environment==='production'){
  //   sendProduction(subject, body.email, template, body.attachments)
  // }
  send(subject, body.EMAIL, template, body.attachments)
}

async function send(subject, email, template, attachments = []) {
  const mailOptions = {
    from: 'test321240@gmail.com',
    to: email,
    subject,
    html: template
    // attachments: [{ filename: 'attachment.txt', content: data }]
  }
  if (attachments.length) {
    mailOptions.attachments = attachments
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Mail has been sent :-', info.response)

    transporter.close()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendEmail
}
