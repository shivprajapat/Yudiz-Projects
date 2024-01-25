const { DepositClient } = require('../../../helper/grpcClient')

async function countDeposit(query) {
  return new Promise((resolve, reject) => {
    (() => {
      DepositClient.countDeposit({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response?.data))
      })
    })()
  })
}
async function countDepositPromo(query) {
  return new Promise((resolve, reject) => {
    (() => {
      DepositClient.countDepositPromo({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response?.data))
      })
    })()
  })
}

module.exports = {
  countDeposit,
  countDepositPromo

}
