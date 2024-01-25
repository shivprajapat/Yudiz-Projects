const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const Sentry = require('@sentry/node')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { messages } = require('../helper/api.responses')

const data = require('../data')

module.exports = (app) => {
  Sentry.init({
    dsn: 'https://515c4430a65f47c6925b4124047ce08d@o516958.ingest.sentry.io/5624082',
    tracesSampleRate: 1.0
  })

  // app.use(morgan('dev'))

  app.use(cors())
  app.use(helmet())
  app.use(express.json())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  /* global appRootPath */
  app.use(express.static(path.join(appRootPath, 'public')))
  app.set('view engine', 'ejs')

  const limiter = rateLimit({
    max: 1000,
    windowMs: 1 * 60 * 1000,
    message: { message: messages.en.limit_reached }
  })
  app.use(limiter)

  app.use(compression({
    filter: function (req, res) {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
      }
      // fallback to standard filter function
      return compression.filter(req, res)
    }
  }))

  // set language in request object
  app.use((req, res, next) => {
    // console.log(req.header('Accept-Language'))
    if (!req.header('Accept-Language')) {
      req.userLanguage = 'en'
    } else if ((data.supportedLanguage).indexOf(req.header('Accept-Language')) !== -1) {
      req.userLanguage = req.header('Accept-Language')
    } else {
      req.userLanguage = 'en'
    }
    next()
  })
}
