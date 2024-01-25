const { pick, removeNull, isValidName, isValidPassword, responseMessage, getFieldObj } = require('../../../helpers/utilityServices')

const updateSubAdmin = async (req, res, next) => {
  const { sName, sMobileNumber, sPassword, eField, eDesignation } = req.body

  req.body = pick(req.body, ['iRoleId', 'sName', 'sMobileNumber', 'sPassword', 'eStatus', 'eField', 'eDesignation'])
  removeNull(req.body)
  if (!sMobileNumber) return responseMessage(req, res, 'BadRequest', 'RequiredField', 'MobileNumber')
  if (sName) {
    if (!isValidName(sName)) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Name')
  }
  if (sPassword) {
    if (!isValidPassword(sPassword)) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Password')
  }

  const resultObj = await getFieldObj()
  const result = Object.keys(resultObj).includes(eField)
  if (eField && !result) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Field')

  if (eDesignation && (!eField || result.indexOf(eDesignation) === -1)) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Designation')

  next()
}

module.exports = {
  updateSubAdmin
}
