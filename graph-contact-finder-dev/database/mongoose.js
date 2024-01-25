// @ts-check
const mongoose = require('mongoose')
const config = require('../config')

const GraphDBConnect = dbConnection(config.MONGO_URL)

function dbConnection (DB_URL) {
  const connection = mongoose.createConnection(DB_URL, { autoCreate: true, autoIndex: true })
  connection.on('connected', () => {
    console.log('Connected to Mongodb ')
  })
  connection.on('error', (err) => {
    console.log('Error while connecting mongodb', err)
  })
  connection.syncIndexes({ background: true })
  return connection
}

module.exports = {
  GraphDBConnect
}
