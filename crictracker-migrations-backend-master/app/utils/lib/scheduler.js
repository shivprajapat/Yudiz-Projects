const { redisclient, redisArticleDb } = require('./redis')
const moment = require('moment')

const scheduleTask = async (taskData, time) => {
  try {
    // utc format-  2021-10-29T18:30:00.000Z
    await redisclient.zadd('scheduler', time, JSON.stringify(taskData))
  } catch (error) {
    console.log({ error })
  }
}

const pollScheduler = async () => {
  try {
    await redisclient.watch('scheduler')

    let data = await redisclient.zrangebyscore(['scheduler', 0, moment().unix(), 'WITHSCORES', 'LIMIT', 0, 1])
    data = data[0]

    if (data) {
      const parsedData = JSON.parse(data)

      if (parsedData.eType && parsedData.eType === 'article') {
        await redisArticleDb
          .multi()
          .rpush(parsedData.eType, JSON.stringify(parsedData.data))
          .exec()
      }

      const updated = await redisclient.zrem('scheduler', data)
      if (updated) {
        pollScheduler()
      } else {
        pollScheduler()
      }
    } else {
      await redisclient.unwatch()
      setTimeout(() => { pollScheduler() }, 1000 * 60)
    }
  } catch (error) {
    console.log({ error })
  }
}
pollScheduler()

module.exports = { scheduleTask }
