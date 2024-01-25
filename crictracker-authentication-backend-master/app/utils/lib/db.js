const mongoose = require('mongoose')
const config = require('../../../config')

const db = {}

db.initialize = () => {
  mongoose
    .connect(config.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      maxPoolSize: config.CONNECTION,
      readPreference: 'secondaryPreferred'
    })
    .then(() => {
      console.log('Database Connected')
    })
    .catch((error) => {
      console.log('Connection Error', error)
    })
}

module.exports = db
