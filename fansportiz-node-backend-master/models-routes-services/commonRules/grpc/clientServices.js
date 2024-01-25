const { AdminClient } = require('../../../helper/grpcClient')

async function createAdminLog(logData) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.createAdminLog({ logData: JSON.stringify(logData) }, function(err, response) {
        if (err) reject(err)
        resolve(response)
      })
    })()
  })
}

module.exports = {
  createAdminLog
}
