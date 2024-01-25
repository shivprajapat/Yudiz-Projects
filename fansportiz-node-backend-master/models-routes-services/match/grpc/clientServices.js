const { NotificationsClient } = require('../../../helper/grpcClient')

async function findNotificationMessage(eKey) {
  return new Promise((resolve, reject) => {
    (() => {
      NotificationsClient.findNotificationMessage({ eKey }, function(err, response) {
        if (err) reject(err)
        resolve(response)
      })
    })()
  })
}

module.exports = {
  findNotificationMessage
}
