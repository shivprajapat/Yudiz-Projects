const client = require('./client')
const controllers = {}

controllers.createTag = (params) => {
  return new Promise((resolve, reject) => {
    client.createTag(params, (err, response) => {
      if (err) {
        console.log('createTag', err)
        reject(err)
      } else {
        console.log('createTag', response)
        resolve(response)
      }
    })
  })
}

controllers.isTagExist = (params) => {
  return new Promise((resolve, reject) => {
    client.isTagExist(params, (err, response) => {
      if (err) {
        console.log('isTagExist', err)
        reject(err)
      } else {
        console.log('isTagExist', response)
        resolve(response)
      }
    })
  })
}

module.exports = controllers
