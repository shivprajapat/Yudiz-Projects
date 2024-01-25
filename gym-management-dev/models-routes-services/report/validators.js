const { param } = require('express-validator')

const get = [
  param('id').isMongoId()
]

module.exports = {
  get
}
