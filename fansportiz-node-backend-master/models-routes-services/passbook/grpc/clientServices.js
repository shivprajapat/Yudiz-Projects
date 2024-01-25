const { WithdrawClient } = require('../../../helper/grpcClient')

async function findWithdraw(query) {
  return new Promise((resolve, reject) => {
    (() => {
      WithdrawClient.findWithdraw({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

module.exports = {
  findWithdraw
}
