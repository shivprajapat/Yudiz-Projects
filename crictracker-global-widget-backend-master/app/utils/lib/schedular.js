
const { redisArticleDb } = require('./redis')

const schedulePoll = async (taskData, time) => {
  try {
    await redisArticleDb.zadd('scheduler', time, JSON.stringify(taskData))
  } catch (error) {
    console.log({ error })
  }
}

module.exports = { schedulePoll }
