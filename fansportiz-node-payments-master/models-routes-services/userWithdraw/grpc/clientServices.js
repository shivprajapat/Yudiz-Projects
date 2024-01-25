const { KycClient, BankDetailsClient, AdminClient } = require('../../../helper/grpcClient')

function findKyc(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      KycClient.findKyc({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, function(err, res) {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

function findBankDetail(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      BankDetailsClient.findBankDetail({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, function(err, res) {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

function findAdmins(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findAdmins({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, function(err, res) {
        if (err) return reject(err)
        resolve(JSON.parse(res.adminData))
      })
    })()
  })
}

module.exports = {
  findKyc,
  findBankDetail,
  findAdmins
}
