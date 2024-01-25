const Redis = require('ioredis')
const config = require('../../config')

const options = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT
}

// const redisclient = new Redis({ ...options, db: 0 })
// const redisAuthDb = new Redis({ ...options, db: 1 })
// const redisMailDb = new Redis({ ...options, db: 2 })
// const redisArticleDb = new Redis({ ...options, db: 3 })
// const redisStreamDb = new Redis({ ...options, db: 4 })
const redisFeedDb = new Redis({ ...options, db: 6 })

redisFeedDb.on('error', function (error) {
  console.log('Error in Redis Feed', error)
  process.exit(1)
})

redisFeedDb.on('connect', function () {
  console.log('redis feed connected')
})

module.exports = { redisFeedDb }
