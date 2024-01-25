const { PromocodeClient, SettingClient, AdminClient, UserClient } = require('../../../helper/grpcClient')

function findPromocode(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      PromocodeClient.findPromocode({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

function createPromocodeStatistics(data) {
  return new Promise((resolve, reject) => {
    (() => {
      PromocodeClient.createPromocodeStatistics({ data: JSON.stringify(data) }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })()
  })
}

function findSetting(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      SettingClient.findSetting({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

function getCurrencySymbol() {
  return new Promise((resolve, reject) => {
    (() => {
      SettingClient.getCurrencySymbol({}, (err, res) => {
        if (err) return reject(err)
        resolve(res.sLogo)
      })
    })()
  })
}

// for find single user
function findUser(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      UserClient.findUser({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.userData))
      })
    })()
  })
}

// for find multiple users
function findUsers(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      UserClient.findUsers({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.userData))
      })
    })()
  })
}

// for count documents of users
function countUsers(query) {
  return new Promise((resolve, reject) => {
    (() => {
      UserClient.countUsers({ query: JSON.stringify(query) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.count))
      })
    })()
  })
}

function createAdminLog(logData) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.createAdminLog({ logData: JSON.stringify(logData) }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })()
  })
}

function findCredential(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      AdminClient.findCredential({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

function updateUserStatistics(query, values, options) {
  return new Promise((resolve, reject) => {
    (() => {
      UserClient.updateUserStatistics({ query: JSON.stringify(query), values: JSON.stringify(values), options: JSON.stringify(options) }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })()
  })
}

module.exports = {
  findPromocode,
  findSetting,
  getCurrencySymbol,
  createPromocodeStatistics,
  findUser,
  findUsers,
  countUsers,
  createAdminLog,
  findCredential,
  updateUserStatistics
}
