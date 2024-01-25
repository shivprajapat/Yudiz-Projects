const amqplib = require('amqplib')
const config = require('../config/config')
const { handleCatchError } = require('./utilities.services')

const amqpConnection = amqplib.connect({
  protocol: config.RABBITMQ_PROTOCOL,
  hostname: config.RABBITMQ_HOST,
  port: config.RABBITMQ_PORT,
  username: config.RABBITMQ_USERNAME,
  password: config.RABBITMQ_PASSWORD
})

const oChannels = {}
async function createChannels() {
  try {
    await amqpConnection.then(async (connection) => {
      [oChannels.senderChannel, oChannels.receiverChannel] = await Promise.all([connection.createChannel(), connection.createChannel()])
    })
  } catch (error) {
    handleCatchError(error)
  }
}
createChannels()

exports.rabbitQueuePush = async (queueName, data) => {
  try {
    await oChannels.senderChannel.assertQueue(queueName, { durable: true })
    const queueData = await oChannels.senderChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true })
    return queueData
  } catch (error) {
    handleCatchError(error)
  }
}

exports.rabbitQueuePop = async (queueName) => {
  try {
    await oChannels.receiverChannel.assertQueue(queueName, { durable: true })
    oChannels.receiverChannel.prefetch(1)
    const data = await oChannels.receiverChannel.get(queueName)
    if (data?.content) {
      oChannels.receiverChannel.ack(data)
      return data.content.toString()
    }
  } catch (error) {
    handleCatchError(error)
  }
}

exports.rabbitQueueLen = async (queueName) => {
  try {
    let queueLen = 0
    const queue = await oChannels.receiverChannel.assertQueue(queueName, { durable: true })
    if (queue?.messageCount) queueLen = queue.messageCount
    return queueLen
  } catch (error) {
    handleCatchError(error)
  }
}
