const { body, param } = require('express-validator')

const clientCheckV1 = [
  body('sName').trim().not().isEmpty(),
  body('sMobNum').trim().not().isEmpty(),
  body('sEmail').trim().not().isEmpty(),
  body('sCountry').trim().not().isEmpty()
]
const clientCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updateClientsCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty(),
  body('sMobNum').trim().not().isEmpty(),
  body('sEmail').trim().not().isEmpty(),
  body('sCountry').trim().not().isEmpty()
]

module.exports = {
  clientCheckV1,
  clientCheckIdV1,
  updateClientsCheckV1
}
