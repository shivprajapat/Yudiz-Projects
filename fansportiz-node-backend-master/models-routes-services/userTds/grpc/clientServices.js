const { KycClient } = require('../../../helper/grpcClient')

async function findKycs(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      KycClient.findKycs({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, function(err, res) {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

module.exports = {
  findKycs
}
