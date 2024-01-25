// @ts-check
const { body } = require('express-validator')
const { reportsKeys } = require('../../enums')

const checkReport = [
  body('eKey').not().isEmpty().isIn(reportsKeys)
]

module.exports = {
  checkReport
}
