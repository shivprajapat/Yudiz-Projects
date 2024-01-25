const mongoose = require('mongoose')
const { ARTICLE_DB_URL, CONNECTION } = require('../../../config')
const connection = {}

connection.articleConnection = mongoose
  .createConnection(ARTICLE_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: CONNECTION,
    readPreference: 'secondaryPreferred'
  })

connection.articleConnection.asPromise().then(() => {
  console.log('Connected to Database')
})

connection.articleConnection.set('syncIndexes', true)

module.exports = connection
