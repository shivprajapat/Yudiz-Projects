const nodemailer = require('nodemailer')
const fs = require('fs')
const ejs = require('ejs')
const config = require('../config/config-file')
const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER)
// const { replaceText } = require('./utilities.services')
// const EmailTemplateModel = require('../models-routes-services/emailTemplates/model')
const { handleCatchError } = require('./utilities.services')

const sendMail = async (OTP, to) => {
  try {
    // const emailTemplate = await EmailTemplateModel.findOne({ sSlug: sSlug }).lean()

    // if (!emailTemplate) {
    //   throw Error('template not found from the database')
    // }

    // const sContent = emailTemplate.sContent
    // const content = replaceText(sContent, replaceData)
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'basic.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { OTP, baseUrl })
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'OTP VERIFICATION',
      html: emailBody
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    handleCatchError(error)
  }
}

// finish_test
const sendMailFinishTest = async (studentName, to) => {
  try {
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'finish_test.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { studentName, baseUrl })
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'Finish Test',
      html: emailBody
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    handleCatchError(error)
  }
}
const sendMailPassword = async (OTP, username, to) => {
  try {
    // const emailTemplate = await EmailTemplateModel.findOne({ sSlug: sSlug }).lean()

    // if (!emailTemplate) {
    //   throw Error('template not found from the database')
    // }

    // const sContent = emailTemplate.sContent
    // const content = replaceText(sContent, replaceData)
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'send_password.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { OTP, username, baseUrl })
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'Password',
      html: emailBody
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    handleCatchError(error)
  }
}

const sendLink = async (Link, to) => {
  try {
    // const emailTemplate = await EmailTemplateModel.findOne({ sSlug: sSlug }).lean()

    // if (!emailTemplate) {
    //   throw Error('template not found from the database')
    // }

    // const sContent = emailTemplate.sContent
    // const content = replaceText(sContent, replaceData)
    const template = fs.readFileSync(config.RESET_PASSWORD_PATH + 'basic.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { Link, baseUrl })
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'Reset Password',
      html: emailBody
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    handleCatchError(error)
  }
}

const sendMailReportPdf = async (path, filename, to, studentName) => {
  try {
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'student_report.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { studentName, baseUrl })
    // path = '/home/ubuntu/ollato-backend/public/uploads/reports/test31_Qa_Test_Report_1673599341739.pdf'
    // filename = 'test31_Qa_Test_Report_1673599341739.pdf'
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'Report',
      html: emailBody,
      attachments: [{
        filename,
        path
      }]
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    console.log(error)
    handleCatchError(error)
  }
}

// csv to client
const sendMailCsv = async (path, filename, to) => {
  try {
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'csv_to_admin.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { baseUrl })
    // path = '/home/ubuntu/ollato-backend/public/uploads/reports/test31_Qa_Test_Report_1673599341739.pdf'
    // filename = 'test31_Qa_Test_Report_1673599341739.pdf'
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'CSV',
      html: emailBody,
      attachments: [{
        filename,
        path
      }]
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    console.log(error)
    handleCatchError(error)
  }
}

// payment success
const sendMailStudentPaymentSuccess = async (to, studentPackage, packageDetail) => {
  try {
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'student_payment_success.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { studentPackage, packageDetail, baseUrl })
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'Payment Sucessfull',
      html: emailBody
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    console.log(error)
    handleCatchError(error)
  }
}

const sendMailCenterPaymentSuccess = async (to, centerPackage, packageDetail) => {
  try {
    const template = fs.readFileSync(config.EMAIL_TEMPLATE_PATH + 'center_payment_success.ejs', {
      encoding: 'utf-8' // Unicode Transformation Format (UTF).
    })
    const baseUrl = process.env.DEPLOY_HOST_URL
    const emailBody = ejs.render(template, { centerPackage, packageDetail, baseUrl })
    const nodeMailerOptions = {
      from: `Ollato ${config.SMTP_FROM}`,
      to: to,
      subject: 'Payment Sucessfull',
      html: emailBody
    }
    const sendedMail = await transporter.sendMail(nodeMailerOptions)
    return sendedMail
  } catch (error) {
    console.log(error)
    handleCatchError(error)
  }
}

module.exports = {
  sendMail,
  sendLink,
  sendMailPassword,
  sendMailFinishTest,
  sendMailReportPdf,
  sendMailCsv,
  sendMailStudentPaymentSuccess,
  sendMailCenterPaymentSuccess
}
