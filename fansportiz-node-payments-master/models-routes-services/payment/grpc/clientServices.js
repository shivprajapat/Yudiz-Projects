const { UserClient } = require('../../../helper/grpcClient')

function findCity(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      UserClient.findCity({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

function findState(query, projection) {
  return new Promise((resolve, reject) => {
    (() => {
      UserClient.findState({ query: JSON.stringify(query), projection: JSON.stringify(projection) }, (err, res) => {
        if (err) return reject(err)
        resolve(JSON.parse(res.data))
      })
    })()
  })
}

module.exports = {
  findCity,
  findState
}
