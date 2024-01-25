const Redis = require('ioredis')
const { RedisPubSub } = require('graphql-redis-subscriptions')

const redisclient = {}
const redisAuthDb = {}
const redisMailDb = {}

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) =>
    // reconnect after
    Math.min(times * 50, 2000)
}
const publisher = new Redis(options)
const subscriber = new Redis(options)
const redisClient = new Redis({ ...options, db: 0 })

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
})

redisclient.setupConfig = function () {
  publisher.setMaxListeners(0)
  subscriber.setMaxListeners(0)
}

redisClient.on('ready', redisclient.setupConfig)

redisClient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisClient.on('connect', function () {
  console.log('redis connected')
})

module.exports = { redisclient, redisAuthDb, redisMailDb, pubsub }
