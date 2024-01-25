const client = require('./client')
const controllers = {}

controllers.modifySeriesTitle = (params) => {
  return new Promise((resolve, reject) => {
    client.modifySeriesTitle(params, (err, response) => {
      if (err) {
        console.log('modifySeriesTitle', err)
        reject(err)
      } else {
        console.log('modifySeriesTitle', response)
        resolve(response)
      }
    })
  })
}

controllers.seriesCategoryOperations = (params) => {
  return new Promise((resolve, reject) => {
    client.seriesCategoryOperations({ seriesParams: JSON.stringify(params) }, (err, response) => {
      if (err) {
        console.log('seriesCategoryOperations', err)
        reject(err)
      } else {
        console.log('seriesCategoryOperations', response)
        resolve(response)
      }
    })
  })
}

controllers.assignLiveEventId = (params) => {
  return new Promise((resolve, reject) => {
    client.assignLiveEventId(params, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

controllers.fantasyArticleValidation = (params) => {
  return new Promise((resolve, reject) => {
    client.fantasyArticleValidation(params, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = controllers
