const client = require('./client')
const controllers = {}

controllers.getMiniScorePriority = async (params) => {
  return new Promise((resolve, reject) => {
    client.getMiniScorePriority(params, (err, response) => {
      console.log({ params })
      if (err) {
        console.log('getMiniScorePriority', err)
        reject(err)
      } else {
        console.log('getMiniScorePriority', response)
        resolve(response)
      }
    })
  })
}

controllers.createPoll = async (params) => {
  return new Promise((resolve, reject) => {
    client.createPoll(params, (err, response) => {
      if (err) {
        console.log('createPoll', err)
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = controllers
