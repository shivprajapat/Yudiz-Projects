const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
// const moment = require('moment')
// const { loggerMiddleware } = require('../helper/utilities.services')
const { loggerMiddleware } = require('../ww.js')
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Access-Control-Allow-Headers', 'Content-Type, Authorization'
  ]
}

module.exports = (app) => {
  app.use(cors(corsOpts))
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(loggerMiddleware)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  // app.use(function timeLog(req, res, next) {
  //   console.log('Time: ', moment().format('MMMM Do YYYY, h:mm:ss a'))
  //   next()
  // })
  // app.use((req, res, next) => {

  // })
}
