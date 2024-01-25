const Redis = require('ioredis')

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}
const redisclient = new Redis({ ...options, db: 0 })
const redisAuthDb = new Redis({ ...options, db: 1 })
const redisMailDb = new Redis({ ...options, db: 2 })
const redisArticleDb = new Redis({ ...options, db: 3 })
const redisMatchDb = new Redis({ ...options, db: 5 })

redisclient.on('error', function (error) {
  console.log('Error in Redis', error)
  process.exit(1)
})

redisclient.on('connect', function () {
  console.log('redis connected')
})

module.exports = { redisclient, redisAuthDb, redisMailDb, redisMatchDb, redisArticleDb }
