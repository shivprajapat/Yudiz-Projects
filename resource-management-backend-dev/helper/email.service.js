const nodemailer = require('nodemailer')
const config = require('../config/config')
const ejs = require('ejs')
const RuntimeCredential = require('../models_routes_service/organizationDetail/runtimecredential.model')
const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER)
const privatekey = require('./gmail-service-378105-8d19a6429169.json')
const organizationDetailModel = require('../models_routes_service/organizationDetail/model')

const region = config.Region
const secretAccessKey = config.AWS_SECRET_ACCESS_KEY
const accessKeyId = config.AWS_ACCESS_KEY_ID
const aws = require('aws-sdk')
const ses = new aws.SES({ accessKeyId, secretAccessKey, region })

const { generateConfigPost } = require('./utilities.services')
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const { google } = require('googleapis')
const axios = require('axios')
const OAuth2 = google.auth.OAuth2

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.sendGrid)

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
    filename = 'emailTemplate.ejs'
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

  console.log('filename', filename)
  console.log('data', data)
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

// async function send (subject, email, template, attachments = []) {
//   try {
//     const Options = {
//       from: 'mailto:pranav.kakadiya@yudiz.com',
//       to: email,
//       subject,
//       html: template
//     // attachments: [{ filename: 'attachment.txt', content: data }]
//     }
//     if (attachments.length) {
//       Options.attachments = attachments
//     }

//     const oAuth2Client = new OAuth2(
//       config.auth.clientId,
//       config.auth.clientSecret,
//       config.auth.redirect_uri
//     )
//     let tokenVar = ''
//     let typeAction = ''
//     const credentials = await RuntimeCredential.findOne({ eStatus: 'Y', eType: 'oAuth', sService: 'gmail' })
//     if (!credentials) {
//       console.log('No credentials found', config.auth)
//       // oAuth2Client.setCredentials({ refresh_token: '1//04vQA9yuXqjKoCgYIARAAGAQSNwF-L9IrexqN80-4xFW1d9jJsv_JJ1WBirmbKjjAXbKTXUwd0LCRe80sW6O4DqJ5Rn0uV6mV60c' })

//       const uri = 'https://www.googleapis.com/oauth2/v4/token'
//       const data = {
//         client_id: config.auth.clientId,
//         client_secret: config.auth.clientSecret,
//         redirect_uri: config.auth.redirect_uri,
//         grant_type: 'refresh_token',
//         refresh_token: config.auth.refreshToken
//       }
//       const url = generateConfigPost(uri, data)
//       const response = await axios(url)

//       tokenVar = {
//         res: {
//           data: {
//             access_token: response.data.access_token,
//             expires_in: response.data.expires_in,
//             scope: response.data.scope,
//             token_type: response.data.token_type,
//             refresh_token: response?.data?.refresh_token || config.auth.refresh_token
//           }
//         }
//       }

//       typeAction = 'create'
//     } else {
//       const getTokenInformation = await oAuth2Client.getTokenInfo(credentials.sAccessToken)
//       console.log(getTokenInformation)
//       if (Math.abs(new Date().getTime() - getTokenInformation.expiry_date) <= 1000  60  5) {
//         const uri = 'https://www.googleapis.com/oauth2/v4/token'
//         const data = {
//           client_id: config.auth.clientId,
//           client_secret: config.auth.clientSecret,
//           redirect_uri: config.auth.redirect_uri,
//           grant_type: 'refresh_token',
//           refresh_token: config.auth.refreshToken
//         }
//         const url = generateConfigPost(uri, data)

//         const response = await axios(url)

//         tokenVar = {
//           res: {
//             data: {
//               access_token: response.data.access_token,
//               expires_in: response.data.expires_in,
//               scope: response.data.scope,
//               token_type: response.data.token_type,
//               refresh_token: response?.data?.refresh_token || config.auth.refresh_token
//             }
//           }
//         }
//         typeAction = 'update'
//         oAuth2Client.setCredentials(
//           {
//             access_token: response.data.access_token,
//             refresh_token: response?.data?.refresh_token || config.auth.refresh_token
//           }
//         )
//         console.log('tokenVar for expired')
//       } else {
//         oAuth2Client.setCredentials(
//           {
//             access_token: credentials.sAccessToken,
//             refresh_token: credentials?.refresh_token || config.auth.refresh_token
//           }
//         )
//         console.log('tokenVar for not expired')
//         // tokenVar = (await oAuth2Client.getAccessToken())
//         tokenVar = credentials.sAccessToken
//       }
//     }

//     console.log('tokenVar', tokenVar)

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         ...config.auth,
//         accessToken: tokenVar
//       },
//       tls: {
//         rejectUnauthorized: false
//       },
//       secure: true,
//       debug: true

//     })

//     const server = await new Promise((resolve, reject) => {
//     // verify connection configuration
//       transporter.verify(function (error, success) {
//         if (success) {
//           console.log('Server is ready to take our messages', success)
//           resolve(success)
//         }
//         reject(error)
//       })
//     })
//     if (!server) {
//       console.log('Server not found', server)
//       return
//     }

//     const mailOptions = {
//       ...Options,
//       text: 'The Gmail API with NodeJS works'
//     }
//     const info = await transporter.sendMail(mailOptions)
//     console.log('Mail has been sent :-', info.response)

//     transporter.close()

//     if (typeAction.trim().length) {
//       if (typeAction === 'create') {
//         await RuntimeCredential.create({
//           eStatus: 'Y',
//           sAccessToken: tokenVar.res.data.access_token,
//           sRefreshToken: tokenVar.res.data.refresh_token,
//           sScope: tokenVar.res.data.scope,
//           eToken_type: tokenVar.res.data.token_type,
//           dExpireAt: tokenVar.res.data.expires_in,
//           eType: 'oAuth',
//           sService: 'gmail'
//         })
//       } else {
//         await RuntimeCredential.updateOne({ eStatus: 'Y', sService: 'gmail', eType: 'oAuth' }, {
//           eStatus: 'Y',
//           sAccessToken: tokenVar.res.data.access_token,
//           sRefreshToken: tokenVar.res.data.refresh_token,
//           sScope: tokenVar.res.data.scope,
//           eToken_type: tokenVar.res.data.token_type,
//           dExpireAt: tokenVar.res.data.expires_in,
//           eType: 'oAuth',
//           sService: 'gmail'
//         })
//       }
//     }
//   } catch (error) {
//     // send(subject, email, template, attachments)
//     console.log(error)
//   }
// }

// async function send1 (subject, email, template, attachments = []) {
//   const Options = {
//     from: 'mailto:pranav.kakadiya@yudiz.com',
//     to: email,
//     subject,
//     html: template
//     // attachments: [{ filename: 'attachment.txt', content: data }]
//   }
//   if (attachments.length) {
//     Options.attachments = attachments
//   }

//   try {
//     const { accessToken } = await oAuth2Client.getAccessToken()

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         ...config.auth,
//         accessToken
//       }
//     })

//     const mailOptions = {
//       ...Options,
//       text: 'The Gmail API with NodeJS works'
//     }
//     const info = await transporter.sendMail(mailOptions)
//     console.log('Mail has been sent :-', info.response)

//     transporter.close()
//   } catch (error) {
//     console.log(error)
//   }
// }

// async function send (subject, email, template, attachments = []) {
//   const Options = {
//     from: 'mailto:pranav.kakadiya@yudiz.com',
//     to: email,
//     subject,
//     html: template
//     // attachments: [{ filename: 'attachment.txt', content: data }]
//   }
//   if (attachments.length) {
//     Options.attachments = attachments
//   }

//   const tokenVar = ''
//   const typeAction = ''
//   const jwtClient = new google.auth.JWT(
//     {
//       email: privatekey.client_email,
//       key: privatekey.private_key,
//       keyId: privatekey.private_key_id,
//       scopes: [
//         'https://www.googleapis.com/auth/spreadsheets',
//         'https://www.googleapis.com/auth/drive',
//         'https://www.googleapis.com/auth/calendar',
//         'https://www.googleapis.com/auth/gmail.send',
//         'https://mail.google.com/'
//       ],
//       subject: privatekey.client_email,
//       token_uri: 'https://oauth2.googleapis.com/token',
//       client_id: privatekey.client_id,
//       client_secret: privatekey.client_secret,
//       keyFile: 'key.json',
//       keyFilename: 'key.json',
//       projectId: privatekey.project_id
//     })

//   const gmail = google.gmail({ version: 'v1', auth: jwtClient })

//   const encodedEmail = Buffer.from(JSON.stringify(Options)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

//   // send email
//   const result = gmail.users.messages.send({
//     userId: 'me',
//     requestBody: {
//       raw: encodedEmail
//     }
//   })

//   console.log('result', result)

//   // console.log('jwtClient', jwtClient)
//   // const credentials = await RuntimeCredential.findOne({ eStatus: 'Y', eType: 'serviceAccount', sService: 'gmail' })
//   // if (!credentials) {
//   //   tokenVar = await jwtClient.authorize()
//   //   typeAction = 'create'
//   // } else {
//   //   const getTokenInfo = await jwtClient.getTokenInfo(credentials.sAccessToken)
//   //   console.log('getTokenInfo', getTokenInfo)
//   //   if (Math.abs(new Date().getTime() - getTokenInfo.expiry_date) < 1000  60  5) {
//   //     tokenVar = await jwtClient.authorize()
//   //     typeAction = 'update'
//   //   } else {
//   //     tokenVar = credentials.sAccessToken
//   //     typeAction = 'update'
//   //   }
//   // }

//   try {
//     // const transporter = nodemailer.createTransport({
//     //   service: 'gmail',
//     //   auth: jwtClient,
//     //   token: tokenVar
//     // })

//     // console.log('tokenVar', tokenVar)

//     // const mailOptions = {
//     //   ...Options,
//     //   text: 'The Gmail API with NodeJS works'
//     // }
//     // const info = await transporter.sendMail(mailOptions)
//     // console.log('Mail has been sent :-', info.response)

//     // transporter.close()

//     // if (typeAction.trim().length) {
//     //   if (typeAction === 'create') {
//     //     await RuntimeCredential.create({
//     //       eStatus: 'Y',
//     //       sAccessToken: tokenVar.access_token,
//     //       sScope: 'https://mail.google.com/',
//     //       eToken_type: tokenVar.token_type,
//     //       dExpireAt: tokenVar.expiry_date,
//     //       eType: 'serviceAccount',
//     //       sService: 'gmail'
//     //     })
//     //   } else {
//     //     await RuntimeCredential.updateOne({ eStatus: 'Y', eType: 'serviceAccount', sService: 'gmail' }, {
//     //       eStatus: 'Y',
//     //       sAccessToken: tokenVar.access_token,
//     //       sRefreshToken: tokenVar.refresh_token,
//     //       sScope: 'https://mail.google.com/',
//     //       eToken_type: tokenVar.token_type,
//     //       dExpireAt: tokenVar.expiry_date,
//     //       eType: 'serviceAccount',
//     //       sService: 'gmail'
//     //     })
//     //   }
//     // }
//   } catch (error) {
//     // send(subject, email, template, attachments)
//     console.log(error)
//   }
// }

// async function send()1 {
//   // The email to be sent
//   const email = {
//     to: 'mailto:pranav.kakadiya@yudiz.com',
//     subject: 'Test email',
//     text: 'This is a test email sent using a Gmail service account.'
//   }

//   // The credentials for the service account
//   const credentials = {
//     client_email: 'mailto:gmailservicer@gmail-service-378105.iam.gserviceaccount.com',
//     private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmWte7rvLIlpDc\nXj3LZi54fUgHkLjQoAiJxVQfGcckQzNAXL7D27tykpSAIKGc/CkOeUDWAZhGkroF\nYWAc0E163s5S/arXhmepPbTfYAcnZTV/uPVvXMCOHiV/kX3dl3l0x5kFyrOSgrDN\nkXvalgM+QYnpGVBpkny2v3k1tDho4K0fSvG/BJbi0koNGKKwjuLUDPDTm4H47JTe\nLsnavYe0eZN0bv0qm9w+ZqJzZQyZt1Xea+6UQJgCMNRb13sY8+yGqQQF+RXmkmUs\nRW9qxKgnAo2AAlRY1h5O0P20MhVQ0eOZXMDWfyrjVD9CZbiF8iPZTfKhIBJIusiS\nu1QC5cBLAgMBAAECggEAYL5eRFChXmT9yc86nKX5dlkHW0YImHXdoB7jyXwGCtC+\nQZWx+IfcHa459+W8ejXc+FssQ7S/w0P0JDZVK0TAhY31kR1AFuw3tPhZckbeOklj\nQpTnXzHRHN7EWOM9vUbUl5sMRUZwTGPe5TbokVDXY9oalW8wOmZvQkEAIvHhjwmh\nJ1mUlRQ9nPzRiCJxztk3v3JrdwhmCPkShnBO9m/f2jEdgzF3ZlLBm1f/Lt7sEPQ8\n+y7ks51ODOjR9f4Gb3wC+Ylz1+3D4P8Q5QNTHTuow4JutciKUm1FYnWrd2iv65gw\nmRJAkFksuAI5jCTJ90WQCjStbV8BDnsQj+S+lJHgAQKBgQD3ude0jpq9HYHMuyUk\nr7w/fj/JE6QHGSLSnz1cLeQVqcwxaxsB6zOamnwBE/miU0JOLwM33Cqfv0cDlgTa\nvshk0YAEWtoNGVZkDgxxQag021AG6fTE784r+QXo3luTQvuQY1XTdHgpvEdiGr/i\n3AO16nL6rKRA1WAlmtCv90xcSwKBgQDuDHhfsIk5yFevBAJbDoXcvA4DBCAiR2jF\n2/RROdNlq7lUAfifK4UzodF0/7+xHNK6h5ofIIkjNhaoHrP3ZTJj1CWjNDPez11l\nWDixqgi2t4WQEjWXMgwnBLKVU9iZAZiaHCTS8afKMP5XA0chjyYhS4+PSAojP4ck\nL+74fGWsAQKBgQDQjPcovWlNzrqIpgDGGuBLP7jpSgysISAs2vxoTwYWqsUJ0ZaC\nDgV6oZXFvpBJdPh8I5389/A2XmylezWJBlZkce7pO6cYof0V7LHS4yh9nyiHOYzk\nAtK6OEIeYpwLpLduPgJyKzpCQIyD7esfTIQfMUos+QyqvDfeULBhg7sYcwKBgCMb\nIbFy9nnYCt5bqAFHvgQUk7hsJlUH1PLBAmHsNjnbPmSeOc03fNhld99aTCnRh15M\n2zTV9oOD2YmHpaDJgsnoInjUHQYx7KMihJHm8owHuqHJna+jiNlEPxX4nIvMCXZI\nykF1s/oEia3JZPcVBlmIrC5EQIJ8PvDeRM7OgawBAoGBANae4NKFW3Jmc37j+O8m\n/jPo0SkT93LIrv3/W35QSW01k0u/7/MpArSRsKxKU65mM9KCZ6DXUkbyMk0X9UBe\n/QeKg6DbkKz0BtklJygFK0qmIB1plMG19vq3EzZfhTcIOEFj1t6LsMA/MWjES6eT\nAW4GJfLakxMb9DBptPt8tbEI\n-----END PRIVATE KEY-----\n'
//   }

//   // Create a JWT client to authorize the request
//   const jwtClient = new google.auth.JWT({
//     email: credentials.client_email,
//     key: credentials.private_key,
//     scopes: ['https://www.googleapis.com/auth/gmail.send']
//   })

//   // Authorize the client and send the email
//   try {
//     await jwtClient.authorize()
//     const gmail = google.gmail({ version: 'v1', auth: jwtClient })
//     const message = Buffer.from(
//       `To: ${email.to}\r\n` +
//       `Subject: ${email.subject}\r\n\r\n` +
//       `${email.text}`
//     ).toString('base64')
//     const response = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: {
//         raw: message
//       }
//     })
//     console.log('Email sent:', response.data)
//   } catch (err) {
//     console.error('Error sending email:', err)
//   }
// }

// async function send (subject, email, template, attachments = []) {
//   try {
//     const params = {
//       // send to list
//       Destination: {
//         ToAddresses: [
//           email
//         ]
//       },
//       Message: {
//         Body: {
//           Html: {
//             Charset: 'UTF-8',
//             Data: template
//           },
//           Text: {
//             Charset: 'UTF-8',
//             Data: 'Hey, this is test.'
//           }
//         },

//         Subject: {
//           Charset: 'UTF-8',
//           Data: subject
//         }
//       },
//       Source: 'mailto:pranav.kakadiya@yudiz.com'
//     }
//     if (attachments.length) {
//       params.Attachments = attachments
//     }
//     // this sends the email
//     const data = await ses.sendEmail(params).promise()
//     console.log('email submitted to SES', data)
//   } catch (error) {
//     console.log(error)
//   }
// }

// async function send(subject, email, template, attachments = []) {
//   try {
//     const msg = {
//       to: email, // Change to your recipient
//       from: 'mailto:pranav.kaakdiya@yudiz.com', // Change to your verified sender
//       subject: 'Sending with SendGrid is Fun',
//       text: 'and easy to do anywhere, even with Node.js',
//       html: '<strong>and easy to do anywhere, even with Node.js</strong>'
//     }

//     try {
//       const data = await sgMail.send(msg)
//     } catch (error) {
//       console.log(error)
//     }
//     console.log('email submitted to SES', 'data')
//     return 'data'
//   } catch (err) {
//     console.log(JSON.stringify(err))
//   }
// }

module.exports = {
  sendEmail
}
