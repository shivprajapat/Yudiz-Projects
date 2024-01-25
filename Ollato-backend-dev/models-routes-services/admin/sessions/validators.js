const { body } = require('express-validator')

const sessionDetail = [
  body('sessionId').not().isEmpty().not().isString()
]

module.exports = {
  sessionDetail
}
