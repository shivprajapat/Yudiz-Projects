const { redisArticleDb } = require('./redis')

const scheduleArticleTask = async (taskData, time) => {
  try {
    // time - timestamp format
    await redisArticleDb.zadd('scheduler', time, JSON.stringify(taskData))
  } catch (error) {
    console.log({ error })
  }
}

module.exports = { scheduleArticleTask }
