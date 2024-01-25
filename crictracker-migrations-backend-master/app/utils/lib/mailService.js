const AWS = require('aws-sdk')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const mailchecker = require('./mailchecker')
const _ = require('../../../global')

AWS.config.region = process.env.AWS_REGION
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETKEY
})

const sesClient = new AWS.SES()

const getTemplate = (filename, body) => {
  body.dDate = _.formattedDate()
  const emailTemplatePath = path.join(__dirname, 'email_templates', filename)
  const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })
  return ejs.render(template, body)
}

const mailTemplates = {
  forgotPassword: (body) => ({
    Subject: { Data: 'Forgot Password' },
    Body: { Html: { Data: getTemplate('forgot_password.html', body) } }
  }),
  loginCredentials: (body) => ({
    Subject: { Data: 'Login Credentials' },
    Body: { Html: { Data: getTemplate('login_credentials.html', body) } }
  })
}

const mailService = {}
// sesClient.createTemplate()
mailService.send = (type, body) => {
  return new Promise((resolve) => {
    const emailOption = {
      Source: process.env.SUPPORT_EMAIL,
      Destination: { ToAddresses: [body.sEmail] },
      Message: type(body)
    }
    mailchecker.isReachable(body.sEmail, (error) => {
      if (error) console.log(error)
      sesClient.sendEmail(emailOption, (err, response) => {
        if (err) console.log(err, err.stack)
        resolve(response)
      })
    })
  })
}

module.exports = { mailService, mailTemplates }
