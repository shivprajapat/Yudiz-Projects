const { redisMailDb } = require('../../utils/lib/redis')

const queuePush = (queueName, data) => {
  return redisMailDb.rpush(queueName, JSON.stringify(data))
}

module.exports = { queuePush }
