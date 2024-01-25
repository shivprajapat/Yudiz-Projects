const client = require('./client')
const controllers = {}

controllers.getPlayerByKey = (params) => {
  return new Promise((resolve, reject) => {
    client.getPlayerByKey(params, (err, response) => {
      if (err) {
        console.log('getPlayerByKey', err)
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

controllers.getTeamByKey = (params) => {
  return new Promise((resolve, reject) => {
    client.getTeamByKey(params, (err, response) => {
      if (err) {
        console.log('getTeamByKey', err)
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = controllers
