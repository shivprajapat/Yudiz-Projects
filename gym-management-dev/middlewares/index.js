const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const data = require('../data')
const { getIp } = require('../helper/utilities.services')
const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH'
  ],
  allowedHeaders: [
    'Access-Control-Allow-Headers', 'Content-Type, Authorization'
  ]
}
module.exports = (app) => {
  app.use(cors(corsOpts))
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(morgan('dev', { skip: (req) => req.path === '/ping' || req.path === '/favicon.ico' }))
  app.use((req, res, next) => {
    const ip = getIp(req)
    req.userIP = ip
    if (!req.header('language')) {
      req.userLanguage = 'English'
    } else if ((data.supportedLanguage).indexOf(req.header('language')) !== -1) {
      req.userLanguage = req.header('language')
    } else {
      req.userLanguage = 'English'
    }
    next()
  })
}
