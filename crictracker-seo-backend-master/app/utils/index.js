const db = require('./lib/db')
const redis = require('./lib/redis')
const { mailService, mailTemplates } = require('./lib/mailService')
const { queuePush } = require('../utils/lib/queue')
const s3 = require('./lib/s3Bucket')
const { defaultSearch, getPaginationValues } = require('./lib/services')
const Sentry = require('./lib/sentry')

module.exports = {
  db,
  redis,
  mailService,
  mailTemplates,
  queuePush,
  s3,
  defaultSearch,
  getPaginationValues,
  Sentry
}
