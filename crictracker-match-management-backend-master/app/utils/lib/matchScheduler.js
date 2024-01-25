const { redisMatchDb } = require('./redis')

const scheduleMatchTask = async (taskData, time) => {
  try {
    // time - timestamp format
    // taskData - {eType: String, data:{iMatchId:'',sMatchKey:"",nLatestInningNumber:1}}

    const exist = await redisMatchDb.zrank('matchScheduler', JSON.stringify(taskData))
    if (typeof exist !== 'number' || taskData.eType === 'standings' || taskData.eType === 'playerStats') {
      await redisMatchDb
        .multi()
        .zadd('matchScheduler', time, JSON.stringify(taskData))
        .exec()
    }
  } catch (error) {
    console.log({ error })
  }
}

module.exports = { scheduleMatchTask }
