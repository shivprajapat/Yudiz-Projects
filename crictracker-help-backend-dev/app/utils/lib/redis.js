const Redis = require('ioredis')

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}
const publisher = new Redis(options)
const subscriber = new Redis(options)
const redisclient = new Redis({ ...options, db: 0 })
const redisAuthDb = new Redis({ ...options, db: 1 })
const redisMailDb = new Redis({ ...options, db: 2 })

redisclient.setupConfig = function () {
  publisher.setMaxListeners(0)
  subscriber.setMaxListeners(0)
}

redisclient.on('ready', redisclient.setupConfig)

redisclient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisclient.on('connect', function () {
  console.log('redis connected')
})

module.exports = { redisclient, redisAuthDb, redisMailDb }
