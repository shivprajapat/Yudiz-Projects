const mongoose = require('mongoose')

const { handleCatchError } = require('../helper/utilities.services')

const config = require('../config/config')

const ResourceManagementDB = connection(config.EMPLOYEE_DB_URL)

// const ResourceManagementBackUpDB = connectionBackUp(config.EMPLOYEE_DB_URL_BACK_UP)

function connection(DB_URL) {
  try {
    const conn = mongoose.createConnection(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    conn.on('connected', () => {
      console.log(`Connected to ${DB_URL} database...`)
      conn.syncIndexes({ background: true })
      // conn.db.listCollections().toArray(function (err, collectionNames) {
      //   if (err) {
      //     console.log(err)
      //   }
      // collectionNames.forEach(function (collection) {
      //   console.log(collection.name)
      // })
      // })
    })

    return conn
  } catch (error) {
    handleCatchError(error)
  }
}

function connectionBackUp(DB_URL) {
  try {
    const conn = mongoose.createConnection(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, readPreference: 'primaryPreferred' })
    conn.on('connected', () => {
      console.log(`Connected to ${DB_URL} database...`)
      conn.syncIndexes({ background: true })
    })
    return conn
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  // ResourceManagementBackUpDB,
  ResourceManagementDB
}
