const db = require('./lib/db')
const redis = require('./lib/redis')
const { mailService, mailTemplates } = require('./lib/mailService')
const { queuePush } = require('../utils/lib/queue')
const s3 = require('./lib/s3Bucket')
const Sentry = require('./lib/sentry')
const { defaultSearch, getPaginationValues, getUserPaginationValues } = require('./lib/services')
const data = require('./lib/data')
const schedular = require('./lib/schedular')

module.exports = {
  db,
  redis,
  mailService,
  mailTemplates,
  queuePush,
  s3,
  defaultSearch,
  getPaginationValues,
  Sentry,
  data,
  getUserPaginationValues,
  schedular
}
