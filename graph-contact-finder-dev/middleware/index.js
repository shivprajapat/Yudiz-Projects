const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const data = require('../enums')

module.exports = (app) => {
  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // set language in request object
  app.use((req, res, next) => {
    if (!req.header('Language')) {
      req.userLanguage = 'English'
    } else if ((data.supportedLanguages).indexOf(req.header('Language')) !== -1) {
      req.userLanguage = req.header('Language')
    } else {
      req.userLanguage = 'English'
    }
    next()
  })
}
