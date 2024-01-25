const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const { _ } = require('./global')
// const mongoose = require('mongoose')
// const cachegoose = require('cachegoose')
const config = require('./config')

const http = require('http')
const apiV1Route = require('./modules')
const { SubscriptionMiddleware: { isFeedSubscriptionAccessible } } = require('./modules/subscriptions')
const FeedServices = require('./modules/feeds/services')

const server = {}

server.initialize = () => {
  // cachegoose(mongoose, {
  //   engine: 'redis',
  //   host: config.REDIS_HOST,
  //   port: config.REDIS_PORT
  // })

  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors({ exposedHeaders: 'Authorization' }))
  app.use(helmet())
  app.use(compression())
  app.use((req, res, next) => {
    const lang = req.header('Language')
    const authorization = req.headers.authorization
    if (lang === 'english') {
      req.userLanguage = 'english'
    } else {
      req.userLanguage = 'english'
    }
    if (authorization) {
      try {
        const decodedToken = _.decodeToken(authorization)
        if (decodedToken) req.decodeToken = decodedToken
      } catch (error) {
        console.log(error)
        next()
      }
    }
    next()
  })
  app.get('/ping', (req, res) => res.send({ ping: 'pong' }))
  app.use('/api', apiV1Route)
  app.get('*', isFeedSubscriptionAccessible, FeedServices.getRssFeedApi)
  const httpServer = http.createServer(app)

  // httpServer = http.Server(app);
  httpServer.timeout = 10000
  httpServer.listen(config.PORT, '0.0.0.0', () => console.log(`Spinning on ${config.PORT}`))
}

module.exports = server
