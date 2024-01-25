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
      if (err) reject(err)
      else resolve(response)
    })
  })
}

controllers.addSeosData = (params) => {
  return new Promise((resolve, reject) => {
    client.addSeosData(params, (err, response) => {
      if (err) reject(err)
      else resolve(response)
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

controllers.getSeoData = (params) => {
  return new Promise((resolve, reject) => {
    client.getSeoData(params, (err, response) => {
      if (err) {
        console.log('getSeoData', err)
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

controllers.getSeoBySlug = (params) => {
  return new Promise((resolve, reject) => {
    client.getSeoBySlug(params, (err, response) => {
      if (err) {
        console.log('getSeoBySlug', err)
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

controllers.getSlugs = (params) => {
  return new Promise((resolve, reject) => {
    client.getSlugs(params, (err, response) => {
      if (err) return reject(err)
      return resolve(response)
    })
  })
}

module.exports = controllers
