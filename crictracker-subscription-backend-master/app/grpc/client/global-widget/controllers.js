const client = require('./client')
const controllers = {}

controllers.getPollById = (params) => {
  return new Promise((resolve, reject) => {
    client.getPollById(params, (err, response) => {
      if (err) {
        console.log('getPollById', err)
        return reject(err)
      } else {
        return resolve(response)
      }
    })
  })
}

module.exports = controllers
