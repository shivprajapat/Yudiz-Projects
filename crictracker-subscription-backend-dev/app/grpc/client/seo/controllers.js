const client = require('./client')
const controllers = {}

controllers.getSeoData = (params) => {
  return new Promise((resolve, reject) => {
    client.getSeoData(params, (err, response) => {
      if (err) return reject(err)
      return resolve(response)
    })
  })
}

controllers.getSeosData = (params) => {
  return new Promise((resolve, reject) => {
    client.getSeosData(params, (err, response) => {
      if (err) return reject(err)
      return resolve(response)
    })
  })
}

module.exports = controllers
