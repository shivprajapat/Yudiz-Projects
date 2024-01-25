const { queuePush, queueLen, bulkQueuePop } = require('../../helper/redis')
const AuthLogsModel = require('../user/authlogs.model')
const { handleCatchError } = require('../../helper/utilities.services')

async function processAuthLogs() {
  let data
  try {
    const length = await queueLen('AuthLogs')
    if (length <= 5) {
      setTimeout(() => { processAuthLogs() }, 2000)
      return
    }
    data = await bulkQueuePop('AuthLogs', 5)
    data = data.map((d) => JSON.parse(d))
    await AuthLogsModel.insertMany(data)
    processAuthLogs()
  } catch (error) {
    await queuePush('dead:AuthLogs', data)
    handleCatchError(error)
    processAuthLogs()
  }
}

module.exports = { processAuthLogs }
