const { redisMatchDb } = require('./redis')
const moment = require('moment')

const pollScheduler = async () => {
  try {
    let data = await redisMatchDb.zrangebyscore(['matchScheduler', 0, moment().unix(), 'WITHSCORES', 'LIMIT', 0, 1])
    data = data[0]

    if (data) {
      const parsedData = JSON.parse(data)

      await redisMatchDb
        .multi()
        .rpush(parsedData?.eType, JSON.stringify(parsedData.data))
        .zrem('matchScheduler', data)
        .exec()

      pollScheduler()
    } else {
      setTimeout(() => { pollScheduler() }, 5000)
    }
  } catch (error) {
    console.log({ error })
    pollScheduler()
  }
}

setTimeout(() => {
  pollScheduler()
}, 5000)
