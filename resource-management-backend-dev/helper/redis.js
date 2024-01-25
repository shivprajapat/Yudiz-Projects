const Redis = require('ioredis')
const config = require('../config/config')
const { messages, status, jsonStatus } = require('../helper/api.responses')
const { handleCatchError, getIp, getPath } = require('../helper/utilities.services')

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD
})

// const redisClient2 = new Redis({
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
//   password: config.REDIS_PASSWORD
// })

redisClient.on('error', function (error) {
  console.log('Error in Redis', error)
  handleCatchError(error)
  process.exit(1)
})

redisClient.on('connect', function () {
  console.log('redis connected')
})

// redisClient2.on('error', function (error) {
//   console.log('Error in Redis', error)
//   handleCatchError(error)
//   process.exit(1)
// })

// redisClient2.on('connect', function () {
//   console.log('redis2 connected')
// })

// notify keyspace event for redisClient2
// redisClient2.config('set', 'notify-keyspace-events', 'KEA')

// redisClient2.psubscribe('__key*__:*', (err, data) => {
//   if (err) {
//     console.log(err)
//   }
//   console.log(data)
// })

// redisClient2.on('pmessage', async (pattern, channel, message) => {
//   console.log(pattern, channel, message)
//   if (channel === '__keyevent@0__:expired') {
//     const data = await redisClient.get(message)
//     console.log(data)
//   }
// })

async function checkLoginLimitByIp(req, res, next) {
  try {
    const ip = getIp(req)
    const path = getPath(req)

    // if ip with in this ips then next

    if (['103.156.143.62',
      '103.156.142.125'].includes(ip)) {
      return next()
    }

    const ipLimit = await redisClient.incr(`${path}:${ip}`)

    if (ipLimit > config.threshold) {
      return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].request) })
    } else {
      const ttl = await redisClient.ttl(`${path}:${ip}`)
      if (ttl === -1) {
        await redisClient.expire(`${path}:${ip}`, 1800)
      }
      return next()
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function checkDownLoadExcelLimitByIp(req, res, next) {
  try {
    const ip = getIp(req)
    const path = getPath(req)
    const ipLimit = await redisClient.incr(`${path}:${ip}`)

    if (ipLimit > config.downloadThreshold) {
      return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].request) })
    } else {
      const ttl = await redisClient.ttl(`${path}:${ip}`)
      if (ttl === -1) {
        await redisClient.expire(`${path}:${ip}`, 30)
      }
      return next()
    }
  } catch (error) {
    handleCatchError(error)
  }
}

async function queuePush(queueName, data) {
  return await redisClient.rpush(queueName, JSON.stringify(data))
}

async function queuePop(queueName, count = 0) {
  return await redisClient.lpop(queueName, count)
  // pop  multiple items from queue
  // return await redisClient.lrange(queueName)
}

async function getDataUsingScore(key, min, max) {
  return await redisClient.zrangebyscore(key, min, max)
}

async function deleteByScore(key, min, max) {
  return await redisClient.zremrangebyscore(key, min, max)
}

module.exports = { checkLoginLimitByIp, queuePush, queuePop, getDataUsingScore, deleteByScore, checkDownLoadExcelLimitByIp, redisClient }
