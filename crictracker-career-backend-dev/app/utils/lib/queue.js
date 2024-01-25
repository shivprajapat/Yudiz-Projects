const { words } = require('./data')
const { redisclient } = require('../../utils/lib/redis')
const Filter = require('bad-words')
const sanitize = new Filter()
if (words.length) sanitize.addWords(...words)

const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisclient.lpop(queueName)
}

module.exports = { queuePush, queuePop }
