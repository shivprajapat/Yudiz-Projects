// @ts-check
const validators = {}
const { body } = require('express-validator')
const { notificationPlatform } = require('../../enums')
const { responseMessage } = require('../../helpers/utilityServices')

validators.adminAddNotification = (req, res, next) => {
  const { iUserId, sTitle, sMessage, iType } = req.body
  if (!iUserId || !sTitle || !sMessage || !iType) return responseMessage(req, res, 'BadRequest', 'AllFieldsAreRequired', '')
  next()
}
validators.adminAddGlobalNotification = (req, res, next) => {
  const { sTitle, sMessage, iType, dExpTime } = req.body
  if (!sTitle || !sMessage || !iType || !dExpTime) return responseMessage(req, res, 'BadRequest', 'AllFieldsAreRequired', '')
  next()
}
validators.changeStatus = (req, res, next) => {
  const { eMode } = req.query
  if (!eMode) return responseMessage(req, res, 'BadRequest', 'RequiredField', 'Mode')
  next()
}
validators.addPushNotification = [
  body('sTitle').not().isEmpty(),
  body('sMessage').not().isEmpty()
]
validators.updatePushNotification = (req, res, next) => {
  const { sTitle, sDescription, ePlatform = ePlatform.toUpperCase() } = req.body
  if (!sTitle && !sDescription && !ePlatform) return responseMessage(req, res, 'BadRequest', 'NoValues', '')
  if (ePlatform) {
    req.body.ePlatform = ePlatform.toUpperCase()
    if (notificationPlatform.indexOf(req.body.ePlatform) === -1) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Platform')
  }
  next()
}

module.exports = validators
