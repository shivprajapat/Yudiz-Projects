const { body } = require('express-validator')

const create = [
  body('date').notEmpty(),
  body('time_slot_id').notEmpty(),
  body('counsellor_status').notEmpty()
]

const getAll = [
  body('start').not().isEmpty().not().isString(),
  body('limit').not().isEmpty().not().isString().isNumeric(),
  body('sort').not().isEmpty(),
  body('order').not().isEmpty()
]

module.exports = {
  create,
  getAll
}
