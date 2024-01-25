// @ts-check
const express = require('express')
const app = express()
const morgan = require('morgan')
const cachegoose = require('recachegoose')
const mongoose = require('mongoose')
const config = require('./config')

cachegoose(mongoose, {
  engine: 'redis',
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD
})

app.use(morgan('dev'))
app.use(express.static('../client/'))

require('./database/neo4j_driver')
require('./middleware/index')(app)
require('./middleware/routes')(app)

global.appRootPath = __dirname

module.exports = app
