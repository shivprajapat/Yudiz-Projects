const mongoose = require('mongoose')
const { handleCatchError } = require('../helper/utilities.services')

const config = require('../config/config')

const StatisticsDBConnect = connection(config.STATISTICS_DB_URL, parseInt(config.STATISTICS_DB_POOLSIZE))

function connection(DB_URL, maxPoolSize = 10) {
  try {
    const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, readPreference: 'secondaryPreferred' }
    // if (!['dev', 'staging'].includes(process.env.NODE_ENV)) {
    //   dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize, readPreference: 'secondaryPreferred' }
    // }
    const conn = mongoose.createConnection(DB_URL, dbConfig)
    conn.on('connected', () => console.log(`Connected to ${DB_URL} database...`))
    return conn
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  StatisticsDBConnect
}
