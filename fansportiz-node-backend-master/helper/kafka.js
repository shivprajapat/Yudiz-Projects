const { Kafka } = require('kafkajs')
const config = require('../config/config')
const { handleCatchError } = require('./utilities.services')
const { oQueueNames } = require('../data')
const brokers = [config.KAFKA_BROKER_1]

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers
})
const producer = kafka.producer()

const oConsumers = {}

async function establishConnection() {
  producer.connect().then(() => console.log('kafka producer connected!'))

  const promises = []
  for (const queueName of Object.keys(oQueueNames)) {
    promises.push(
      oConsumers[queueName] = kafka.consumer({ groupId: config.KAFKA_CONSUMER_GROUP_ID }),
      oConsumers[queueName].connect(),
      oConsumers[queueName].subscribe({ topic: oQueueNames[queueName], fromBeginning: true })
    )
  }
  Promise.all(promises).then(() => console.log('kafka consumers connected!'))
    .catch(error => console.log(`kafka consumers Error: ${error}`))
}
establishConnection()

exports.kafkaQueuePush = async (queueName, data) => {
  try {
    const producerData = await producer.send({
      topic: queueName,
      messages: [
        { value: Buffer.from(JSON.stringify(data)) }
      ]
    })
    return producerData
  } catch (error) {
    handleCatchError(error)
  }
}

exports.kafkaQueuePop = async (queueName, callback) => {
  try {
    const consumerName = Object.keys(oQueueNames).find(key => oQueueNames[key] === queueName)
    await oConsumers[consumerName].run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        if (message?.value) {
          console.log({ partition, offset: message.offset, value: JSON.parse(message.value.toString()) })
          callback(null, JSON.parse(message.value.toString()))
        }
        await oConsumers[consumerName].commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }])
      }
    })
  } catch (error) {
    callback(error)
    handleCatchError(error)
  }
}
