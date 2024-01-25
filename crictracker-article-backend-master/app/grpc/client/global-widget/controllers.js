const client = require('./client')
const controllers = {}

controllers.updateGlobalWidgetByType = (params) => {
  return new Promise((resolve, reject) => {
    client.updateGlobalWidgetByType(params, (err, response) => {
      console.log({ params })
      if (err) {
        console.log('updateGlobalWidgetByType', err)
        reject(err)
      } else {
        console.log('updateGlobalWidgetByType', response)
        resolve(response)
      }
    })
  })
}

module.exports = controllers
