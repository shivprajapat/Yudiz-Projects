const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const nodemailer = require('nodemailer')
const config = require('../../../config')

const getTemplate = (filename, body) => {
  const emailTemplatePath = path.join(__dirname, 'email_templates', filename)
  const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })
  return ejs.render(template, body)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: config.SMTP_EMAIL,
    pass: config.SMTP_PASSWORD
  },
  secure: false
})

const mailTemplates = {
  forgotPassword: (body) => ({
    subject: 'Forgot Password',
    html: getTemplate('forgot_password.html', body)
  }),
  loginCredentials: (body) => ({
    subject: 'Login Credentials',
    html: getTemplate('login_credentials.html', body)
  }),
  sendOTP: (body) => ({
    subject: 'OTP ',
    html: getTemplate('send_otp.html', body)
  })
}

const mailService = {}
mailService.send = (type, body) => {
  return new Promise((resolve) => {
    const emailOption = {
      from: config.SUPPORT_EMAIL,
      to: body.sEmail,
      subject: type(body).subject,
      html: type(body).html
    }
    transporter.sendMail(emailOption, (err, response) => {
      if (err) console.log(err, err.stack)
      resolve(response)
    })
  })
}

module.exports = { mailService, mailTemplates }
