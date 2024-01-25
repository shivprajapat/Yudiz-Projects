require('dotenv').config()

let config
if (process.env.NODE_ENV === 'Development') {
  config = require('./development')
} else if (process.env.NODE_ENV === 'Production') {
  config = require('./production')
} else {
  config = require('./test')
}

module.exports = config
