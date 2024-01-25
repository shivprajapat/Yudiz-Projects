// @ts-check
const Redis = require('ioredis')
const config = require('../config')
const { message } = require('../responses/')

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD
})

redisClient.on('error', e => {
  console.log(message.English.RedisError, e.message)
  process.exit(1)
})

redisClient.on('connect', () => {
  console.log('Connected to Redis')
})

module.exports = {
  redisClient
}
