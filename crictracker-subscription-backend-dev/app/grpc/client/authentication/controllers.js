const client = require('./client')
const controllers = {}

controllers.getAdmin = (params) => {
  return new Promise((resolve, reject) => {
    client.getAdmin(params, (err, response) => {
      if (err) {
        console.log('getAdmin', err)
        return reject(err)
      } else {
        console.log('getAdmin', response)
        return resolve(response)
      }
    })
  })
}

module.exports = controllers
