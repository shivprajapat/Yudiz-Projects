// const db = require('./lib/db')
const redis = require('./lib/redis')
const { queuePush } = require('./lib/queue')
const s3 = require('./lib/s3Bucket')
const Sentry = require('./lib/sentry')
const { defaultSearch, getPaginationValues, getUserPaginationValues, getS3ImageURL, updateCounts } = require('./lib/services')
const data = require('./lib/data')
const { readTime } = require('./lib/read-time-estimate')
const { scheduleTask } = require('./lib/scheduler')

module.exports = {
  queuePush,
  s3,
  redis,
  defaultSearch,
  getPaginationValues,
  getUserPaginationValues,
  getS3ImageURL,
  readTime,
  Sentry,
  data,
  scheduleTask,
  updateCounts
}
