require('../lib/db')
const Redis = require('ioredis')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const config = require('../../../config')
// const { bookmarks: BookmarkModel, categories: CategoryModel, tags: TagsModel } = require('../../model')

const options = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT
}
const publisher = new Redis(options)
const subscriber = new Redis(options)
const redisclient = new Redis({ ...options, db: 0 })
const redisAuthDb = new Redis({ ...options, db: 1 })
const redisMailDb = new Redis({ ...options, db: 2 })
const redisArticleDb = new Redis({ ...options, db: 3 })

redisclient.setupConfig = function () {
  publisher.setMaxListeners(0)
  subscriber.setMaxListeners(0)
}

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
})

redisclient.on('ready', redisclient.setupConfig)

redisclient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisclient.on('connect', function () {
  console.log('redis connected')
})

const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

module.exports = {
  redisclient, redisAuthDb, redisMailDb, redisArticleDb, pubsub, queuePush
}
