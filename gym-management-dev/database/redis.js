const Redis = require('ioredis')
const config = require('../config/config')
const sanitizeHtml = require('sanitize-html')
const { handleCatchError } = require('../helper/utilities.services')
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
  queuePush: function (queueName, data) {
    return redisClient.rpush(queueName, JSON.stringify(data))
  },

  queuePop: function (queueName, data) {
    return redisClient.lpop(queueName)
  },

  bulkQueuePop: function (queueName, limit) {
    return redisClient.lpop(queueName, limit)
  },

  queueLen: function (queueName) {
    return redisClient.llen(queueName)
  },
  checkRateLimit: async function (threshold, path, ip) {
    try {
      const ipLimit = await redisClient.incr(`${path}:${ip}`)
      if (ipLimit > threshold) {
        return 'LIMIT_REACHED'
      } else {
        const ttl = await redisClient.ttl(`${path}:${ip}`)
        if (ttl === -1) {
          await redisClient.expire(`${path}:${ip}`, 1800)
        }
        return
      }
    } catch (error) {
      handleCatchError(error)
    }
  },
  cacheRoute: function (duration) {
    return async (req, res, next) => {
      const key = '__express__' + sanitizeHtml(req.originalUrl || req.url)
      if (process.env.NODE_ENV === 'dev') return next()
      const cachedBody = await redisClient.get(key)
      if (cachedBody) {
        res.setHeader('is-cache', 1)
        res.setHeader('content-type', 'application/json')
        res.status(JSON.parse(cachedBody)?.status || 200)
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
  }
}
