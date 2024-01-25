const { redisArticleDb } = require('./redis')
const moment = require('moment')

// !*  with article here live blog content and poll are scheduling.

const pollScheduler = async () => {
  try {
    let data = await redisArticleDb.zrangebyscore(['scheduler', 0, moment().unix(), 'WITHSCORES', 'LIMIT', 0, 1])
    data = data[0]

    if (data) {
      const parsedData = JSON.parse(data)

      await redisArticleDb
        .multi()
        .rpush(parsedData?.eType, JSON.stringify(parsedData.data))
        .zrem('scheduler', data)
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
