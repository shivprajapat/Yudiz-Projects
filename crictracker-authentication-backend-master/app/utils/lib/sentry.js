const Sentry = require('@sentry/node')
const config = require('../../../config')

Sentry.init({
  dsn: config.SENTRY_DSN,
  tracesSampleRate: 1.0
})

module.exports = Sentry
