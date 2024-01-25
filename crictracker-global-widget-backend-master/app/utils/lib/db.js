const mongoose = require('mongoose')
const { DB_URL, CONNECTION } = require('.././../../config')
const db = {}

db.initialize = () => {
  mongoose
    .connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      readPreference: 'secondaryPreferred',
      maxPoolSize: CONNECTION
    })
    .then(() => {
      console.log('Database Connected')
    })
    .catch((error) => {
      console.log('Connection Error', error)
    })
  mongoose.syncIndexes().then().catch()
}

module.exports = db
