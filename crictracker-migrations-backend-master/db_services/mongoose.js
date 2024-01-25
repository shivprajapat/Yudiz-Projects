const mongoose = require('mongoose')
const config = require('../config')

const MigrationDBConnect = connection(config.MIGRATION_DB_URL, 5, 'Migration')
const SeoDBConnect = connection(config.SEO_DB_URL, 5, 'Seo')
const AuthenticationDBConnect = connection(config.AUTHENTICATION_DB_URL, 5, 'Authentication')
const ArticleDBConnect = connection(config.ARTICLE_DB_URL, 5, 'Article')
const MatchManagementDBConnect = connection(config.MATCHMANAGEMENT_DB_URL, 5, 'MatchManagement')
const CareerDBConnect = connection(config.CAREER_DB_URL, 5, 'Career')
const GlobalWidgetDBConnect = connection(config.GLOBAL_WIDGET_DB_URL, 5, 'GlobalWidget')

function connection(DB_URL, maxPoolSize = 5, type) {
  try {
    const conn = mongoose.createConnection(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize, readPreference: 'secondaryPreferred' })
    conn.on('connected', () => console.log(`Connected to ${type} database...`))
    return conn
  } catch (error) {
    // handleCatchError(error)
  }
}

// mongoose.set('useFindAndModify', false)
// mongoose.set('debug', true)
module.exports = {
  MigrationDBConnect,
  SeoDBConnect,
  AuthenticationDBConnect,
  ArticleDBConnect,
  MatchManagementDBConnect,
  CareerDBConnect,
  GlobalWidgetDBConnect
}
