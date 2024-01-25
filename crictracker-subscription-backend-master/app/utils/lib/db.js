const mongoose = require('mongoose')
const config = require('../../../config')

const db = {}

// mongoose.set('debug', true)

db.initialize = () => {
  mongoose
    .connect(config.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => {
      console.log('Database Connected')
    })
    .catch((error) => {
      console.log('Connection Error', error)
    })
}

module.exports = db
