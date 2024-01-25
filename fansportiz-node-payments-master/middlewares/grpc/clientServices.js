const { AdminClient } = require('../../helper/grpcClient')

function findByToken(token) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findByToken({ token }, (err, res) => {
        if (err) return reject(err)
        if (!res?._id) return resolve(null)
        resolve(res)
      })
    })()
  })
}
function findByDepositToken(token) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findByDepositToken({ token }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })()
  })
}

function findRole(aRole) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findRole({ aRole }, (err, res) => {
        if (err) return reject(err)
        resolve([res])
      })
    })()
  })
}

module.exports = {
  findByToken,
  findRole,
  findByDepositToken
}
