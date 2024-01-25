const { body, param } = require('express-validator')
const { status, jsonStatus } = require('../../helper/api.responses')
const { searchValidate, isValidNumberForCurrency } = require('../../helper/utilities.services')

// const currencyCheckV1 = [
//   body('sName').trim().not().isEmpty(),
//   body('sSymbol').trim().not().isEmpty(),
//   body('nUSDCompare').isNumeric()
// ]
const currencyCheckIdV1 = [
  param('id').not().isEmpty().isMongoId()
]

const updatecurrencyCheckV1 = [
  param('id').not().isEmpty().isMongoId(),
  body('sName').trim().not().isEmpty(),
  body('sSymbol').trim().not().isEmpty()
]

const currencyCheckV1 = function (req, res, next) {
  const errors = []

  if (!req.body.sName.trim()) {
    errors.push({ msg: 'Invalid Value', value: req.body?.sName || '', location: 'body', param: 'name' })
  }
  if (!req.body.sSymbol.trim()) {
    errors.push({ msg: 'Invalid Value', value: req.body?.sSymbol || '', location: 'body', param: 'symbol' })
  }
  if (!req.body.nUSDCompare) {
    errors.push({ msg: 'Invalid Value', value: req.body?.nUSDCompare || '', location: 'body', param: 'nUSDCompare' })
  }
  if ((typeof req.body.nUSDCompare) === 'string' || isNaN(req.body.nUSDCompare)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.nUSDCompare || '', location: 'body', param: 'nUSDCompare' })
  }
  if (errors.length) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors })
  }
  next()
}

module.exports = {
  currencyCheckV1,
  currencyCheckIdV1,
  updatecurrencyCheckV1
}
