const db = require('./lib/db')
const redis = require('./lib/redis')
const { mailService, mailTemplates } = require('./lib/mailService')
const { queuePush, clientQueuePush } = require('./lib/queue')
const s3 = require('./lib/s3Bucket')
const otpService = require('./lib/otpService')
const services = require('./lib/utillityServices')
const Sentry = require('./lib/sentry')
const { defaultSearch, getPaginationValues, getS3ImageURL } = require('./lib/services')

module.exports = {
  db,
  redis,
  mailService,
  mailTemplates,
  queuePush,
  clientQueuePush,
  s3,
  otpService,
  services,
  defaultSearch,
  getPaginationValues,
  Sentry,
  getS3ImageURL
}
