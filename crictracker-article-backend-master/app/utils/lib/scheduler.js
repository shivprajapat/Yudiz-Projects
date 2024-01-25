const { redisArticleDb } = require('./redis')

const scheduleArticleTask = async (taskData, time) => {
  try {
    // utc format-  2021-10-29T18:30:00.000Z
    await redisArticleDb.zadd('scheduler', time, JSON.stringify(taskData))
  } catch (error) {
    console.log({ error })
  }
}

// !* Merge with article task. remove after some time
// const sheduleContentTask = async (taskData, time) => {
//   try {
//     // utc format-  2021-10-29T18:30:00.000Z
//     await redisArticleDb.zadd('blogcontent', time, JSON.stringify(taskData))
//   } catch (error) {
//     console.log({ error })
//   }
// }

module.exports = { scheduleArticleTask }
