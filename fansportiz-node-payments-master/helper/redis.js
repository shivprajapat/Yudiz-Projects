const Redis = require('ioredis')
const config = require('../config/config')
const { handleCatchError } = require('./utilities.services')
const sanitizeHtml = require('sanitize-html')

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD
})

redisClient.on('error', function (error) {
  console.log('Error in Redis', error)
  handleCatchError(error)
  process.exit(1)
})

redisClient.on('connect', function () {
  console.log('redis connected')
})

module.exports = {
  cacheRoute: function (duration) {
    return async (req, res, next) => {
      const key = '__express__' + sanitizeHtml(req.originalUrl || req.url)
      if (process.env.NODE_ENV === 'dev') return next()
      const cachedBody = await redisClient.get(key)
      if (cachedBody) {
        res.setHeader('is-cache', 1)
        res.setHeader('content-type', 'application/json')
        return res.send(cachedBody)
      } else {
        res.sendResponse = res.send
        res.send = (body) => {
          redisClient.set(key, body, 'EX', duration)
          res.setHeader('content-type', 'application/json')
          res.sendResponse(body)
        }
        next()
      }
    }
  },

  queuePush: function (queueName, data) {
    return redisClient.rpush(queueName, JSON.stringify(data))
  },
  redisClient
}
