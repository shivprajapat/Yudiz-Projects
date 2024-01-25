const { body } = require('express-validator')
const { isValidName, isMobileNumber, isValidPassword, responseMessage, getFieldObj } = require('../../../helpers/utilityServices')

const createSubAdmin = async (req, res, next) => {
  const { sName, sMobileNumber, sPassword, iRoleId, eField, eDesignation } = req.body
  if (!sName || !sMobileNumber || !sPassword || !iRoleId) { return responseMessage(req, res, 'BadRequest', 'AllFieldsAreRequired', '') }

  if (!isValidName(sName)) { return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Name') }

  if (!isMobileNumber(sMobileNumber) || typeof sMobileNumber !== 'string') { return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'MobileNumber') }

  if (!isValidPassword(sPassword)) { return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Password') }

  const fieldObj = await getFieldObj()
  const fieldExist = Object.keys(fieldObj).includes(eField)
  if (eField && !fieldExist) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Field')

  if (eDesignation && (!eField || fieldObj[eField].indexOf(eDesignation) === -1)) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Designation')

  return next()
}

const login = [
  body('sMobileNumber').not().isEmpty().isLength({ min: 10, max: 10 }),
  body('sPassword').not().isEmpty()
]

module.exports = {
  createSubAdmin,
  login
}
