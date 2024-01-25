const { body, param } = require('express-validator')
const { status, jsonStatus } = require('../../helper/api.responses')
const CurrencyModel = require('../Currency/model')
const ObjectId = require('mongoose').Types.ObjectId

const checkUser = [
  body('sEmail').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('iDepartmentId').not().isEmpty(),
  body('sMobNum').not().isEmpty(),
  body('sEmpId').not().isEmpty(),
  body('iJobProfileId').not().isEmpty(),
  body('nExperience').not().isEmpty()
  // body('eGrade').not().isEmpty()
]

const registerUserV1 = [
  body('sEmail').not().isEmpty(),
  body('sPassword').not().isEmpty(),
  body('sMobNum').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('sEmpId').not().isEmpty()
]

const loginUserV1 = [
  body('sLogin').not().isEmpty(),
  body('sPassword').not().isEmpty()
  // body('sPushToken').not().isEmpty()
]

const changePasswordValidateV1 = [
  body('sCurrentPassword').not().isEmpty(),
  body('sNewPassword').not().isEmpty(),
  body('sConfirmPassword').not().isEmpty()
]

const CreateEmployee = [
  body('sEmail').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('iDepartmentId').not().isEmpty(),
  body('sMobNum').not().isEmpty(),
  body('sEmpId').not().isEmpty(),
  body('iJobProfileId').not().isEmpty(),
  body('nExperience').not().isEmpty(),
  body('iBranchId').not().isEmpty().isMongoId(),
  body('eShowAllProjects').not().isEmpty().isIn(['OWN', 'ALL'])
  // body('eGrade').not().isEmpty()
]

const EmployeeUpdate = [
  param('id').not().isEmpty().isMongoId(),
  body('sEmail').not().isEmpty(),
  body('sName').not().isEmpty(),
  body('iDepartmentId').not().isEmpty(),
  body('sMobNum').not().isEmpty(),
  body('sEmpId').not().isEmpty(),
  body('iJobProfileId').not().isEmpty(),
  body('nExperience').not().isEmpty(),
  body('iBranchId').not().isEmpty().isMongoId(),
  body('eShowAllProjects').not().isEmpty().isIn(['OWN', 'ALL'])
  // body('eGrade').not().isEmpty()
]

const resetPasswordV1 = [
  body('sNewPassword').not().isEmpty(),
  body('sConfirmPassword').not().isEmpty(),
  body('otp').not().isEmpty()
]

const forgotPasswordV1 = [
  body('sLogin').not().isEmpty()
]

const deleteEmployee = [
  param('id').not().isEmpty().isMongoId()
]

const EmployeeDetail = [
  param('id').not().isEmpty().isMongoId()
]

const updateUserProfileV1 = [
  body('sMobNum').not().isEmpty(),
  body('sEmpName').not().isEmpty(),
  body('sEmpId').not().isEmpty(),
  body('iJobProfileId').not().isEmpty().isMongoId()
]

const userPreSignedUrlCheck = [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
]

const deviceTokenValidate = [
  body('deviceToken').not().isEmpty()
]

const currencyCheckV1 = [
  body('iEmployeeId').not().isEmpty().isMongoId(),
  body('nPaid').not().isEmpty().isNumeric()
]

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id) {
      return true
    }
    return false
  }
  return false
}

const checkCurrency = async function (req, res, next) {
  const errors = []

  if (!req.body?.iEmployeeId || !isValidObjectId(req.body?.iEmployeeId)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.iEmployeeId || '', location: 'body', param: 'iEmployeeId' })
  }

  if (!req.body?.nPaid || (typeof req.body.nPaid) === 'string' || isNaN(req.body.nPaid)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.nPaid || '', location: 'body', param: 'nPaid' })
  }

  if (req.body?.aCurrency?.length) {
    const CurrencyExists = await CurrencyModel.find({ eStatus: 'Y' }).lean()
    const reqACurrency = req.body.aCurrency
    if (CurrencyExists.length < reqACurrency?.length || 0) {
      errors.push({ msg: 'Invalid Currency', value: req.body?.aCurrency || '', location: 'body', param: 'aCurrency' })
    } else {
      const aCurrency = reqACurrency.map((currency) => currency.iCurrencyId.toString())
      const aCurrencyExists = CurrencyExists.map((currency) => currency._id.toString())
      const aCurrencyDiff = aCurrency.filter((currency) => !aCurrencyExists.includes(currency))
      if (aCurrencyDiff.length) {
        errors.push({ msg: 'Invalid Currency', value: req.body?.aCurrency || '', location: 'body', param: 'aCurrency' })
      } else {
        const aCurrencyValue = reqACurrency.map((currency) => currency?.nCost || 0)
        const aCurrencyValueDiff = aCurrencyValue.filter((currency) => currency <= 0)
        if (aCurrencyValueDiff.length) {
          errors.push({ msg: 'Invalid Currency Value', value: req.body?.aCurrency || '', location: 'body', param: 'aCurrency' })
        }
      }
    }
  }

  if (errors.length) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors })
  }
  next()
}

module.exports = {
  checkUser,
  registerUserV1,
  loginUserV1,
  changePasswordValidateV1,
  updateUserProfileV1,
  userPreSignedUrlCheck,
  resetPasswordV1,
  forgotPasswordV1,
  CreateEmployee,
  deleteEmployee,
  EmployeeDetail,
  EmployeeUpdate,
  deviceTokenValidate,
  currencyCheckV1,
  checkCurrency
}
