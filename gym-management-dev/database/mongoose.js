const mongoose = require('mongoose')
const { handleCatchError } = require('../helper/utilities.services')

const config = require('../config/config')

function connection (DB_URL, maxPoolSize = 5, DB) {
  try {
    const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true }
    const conn = mongoose.createConnection(DB_URL, dbConfig)
    conn.on('connected', () => console.log(`Connected to ${DB} database.`))
    conn.syncIndexes({ background: true })
    return conn
  } catch (error) {
    handleCatchError(error)
  }
}

const gymDBConnect = connection(config.DB_URL, parseInt(config.DB_POOLSIZE), 'gymDB')
module.exports = {
  gymDBConnect
}
