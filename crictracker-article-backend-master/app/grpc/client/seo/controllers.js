const client = require('./client')
const controllers = {}

controllers.updateEntitySeo = (params) => {
  return new Promise((resolve, reject) => {
    client.updateEntitySeo(params, (err, response) => {
      if (err) {
        console.log('updateEntitySeo', err)
        reject(err)
      } else {
        console.log('updateEntitySeo', response)
        resolve(response)
      }
    })
  })
}

controllers.addSeoData = (params) => {
  return new Promise((resolve, reject) => {
    client.addSeoData(params, (err, response) => {
      if (err) {
        console.log('addSeoData', err)
        reject(err)
      } else {
        console.log('addSeoData', response)
        resolve(response)
      }
    })
  })
}

controllers.insertSeo = (params) => {
  return new Promise((resolve, reject) => {
    client.insertSeo(params, (err, response) => {
      if (err) {
        console.log('insertSeo', err)
        reject(err)
      } else {
        console.log('insertSeo', response)
        resolve(response)
      }
    })
  })
}

controllers.editSeo = (params) => {
  return new Promise((resolve, reject) => {
    client.editSeo(params, (err, response) => {
      if (err) {
        console.log('editSeo', err)
        reject(err)
      } else {
        console.log('editSeo', response)
        resolve(response)
      }
    })
  })
}

module.exports = controllers
