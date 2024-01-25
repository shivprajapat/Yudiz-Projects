const redis = require('./lib/redis')
const { mailService, mailTemplates } = require('./lib/mailService')
const { queuePush } = require('./lib/queue')
const s3 = require('./lib/s3Bucket')
const Sentry = require('./lib/sentry')
const { getS3ImageURL, defaultSearch, getPaginationValues, getUserPaginationValues, getArticleVideoLimit, updateCategoryCount } = require('./lib/services')
const data = require('./lib/data')
const { scheduleArticleTask } = require('./lib/scheduler')
const { updateSeriesCategoryStream, updateTagStream, addSeoDataToStream } = require('./lib/redis')

module.exports = {
  redis,
  mailService,
  mailTemplates,
  queuePush,
  s3,
  defaultSearch,
  getPaginationValues,
  getUserPaginationValues,
  Sentry,
  data,
  scheduleArticleTask,
  getArticleVideoLimit,
  updateSeriesCategoryStream,
  getS3ImageURL,
  updateCategoryCount,
  updateTagStream,
  addSeoDataToStream
}
