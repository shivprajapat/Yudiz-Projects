const { body, query } = require('express-validator')

const addSubscriptionLog = [
  body('iSubscriptionId').isMongoId(),
  body('nDay').isInt({ min: 1 })
]
const unFreeze = [
  body('endDate').isDate().notEmpty().trim(),
  body('iSubscriptionId').isMongoId()
]
const listAll = [
  query('iSubscriptionId').isMongoId().optional()
]
module.exports = {
  addSubscriptionLog,
  unFreeze,
  listAll
}
