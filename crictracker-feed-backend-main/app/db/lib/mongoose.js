const mongoose = require('mongoose')
const { FEED_DB_URL, ARTICLE_DB_URL, CONNECTION } = require('../../../config')
const connection = {}

connection.articleConnection = mongoose
  .createConnection(ARTICLE_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: CONNECTION,
    readPreference: 'secondaryPreferred'
  })

connection.articleConnection.on('connected', () => {
  console.log('Connected to Article database...')
})

connection.articleConnection.syncIndexes().then().catch()

connection.feedConnection = mongoose
  .createConnection(FEED_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: CONNECTION,
    readPreference: 'secondaryPreferred'
  })

connection.feedConnection.on('connected', () => {
  console.log('Connected to Feed database...')
})

connection.feedConnection.syncIndexes().then().catch()
// mongoose.set('debug', true)
module.exports = connection
