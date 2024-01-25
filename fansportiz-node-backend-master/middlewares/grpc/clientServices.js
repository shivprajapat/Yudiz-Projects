const { AdminClient, EmailTemplateClient } = require('../../helper/grpcClient')

async function findByToken(token) {
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
async function findByDepositToken(token) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findByDepositToken({ token }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })()
  })
}

async function findRole(aRole) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findRole({ aRole }, (err, res) => {
        if (err) return reject(err)
        resolve([res])
      })
    })()
  })
}

async function findEmailTemplate(query) {
  return new Promise((resolve, reject) => {
    (() => {
      EmailTemplateClient.findEmailTemplate({ query: JSON.stringify(query) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

module.exports = {
  findByToken,
  findRole,
  findByDepositToken,
  findEmailTemplate
}
