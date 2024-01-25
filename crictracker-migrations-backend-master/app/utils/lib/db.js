const mongoose = require('mongoose')
const { DB_URL } = require('../../../config')
const db = {}

db.initialize = () => {
  mongoose
    .connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
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
