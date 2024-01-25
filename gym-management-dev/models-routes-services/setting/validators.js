const { body, param } = require('express-validator')

const add = [
  body('oWebSettings.sCurrency').trim()
]

const update = [
  param('id').isMongoId(),
  body('oWebSettings.sCurrency').trim()
]

module.exports = { add, update }
