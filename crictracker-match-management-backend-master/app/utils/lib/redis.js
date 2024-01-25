const Redis = require('ioredis')
const { RedisPubSub } = require('graphql-redis-subscriptions')

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}
const publisher = new Redis(options)
const subscriber = new Redis(options)
const redisclient = new Redis({ ...options, db: 0 })
const redisAuthDB = new Redis({ ...options, db: 1 })
const redisMailDB = new Redis({ ...options, db: 2 })
const redisArticleDb = new Redis({ ...options, db: 3 })
const redisStreamDb = new Redis({ ...options, db: 4 })
const redisMatchDb = new Redis({ ...options, db: 5 })

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
})

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

module.exports = { redisclient, redisArticleDb, redisAuthDB, redisMailDB, pubsub, redisMatchDb, redisStreamDb }
