
const { status, jsonStatus, messages } = require('../helper/api.response')
const { validationResult } = require('express-validator')
const { decodeToken } = require('../helper/utilities.services')
const AdminModel = require('../models-routes-services/admin/model')
const { checkRateLimit } = require('../database/redis')

const validate = function (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(status.UnprocessableEntity)
      .json({ status: jsonStatus.UnprocessableEntity, errors: errors.array() })
  }
  next()
}

const checkRouteRateLimitStatus = async (req, res, next, cacheKey) => {
  try {
    const rateLimitStatus = await checkRateLimit(5, cacheKey, req.ip)
    if (rateLimitStatus === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached })
    return next()
  } catch (error) {
    return res.status(status.InternalServerError).json({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error })
  }
}

const isAdminAuthorized = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(status.Unauthorized).json({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })

    const decoded = decodeToken(token)
    if (!decoded) return res.status(status.Unauthorized).json({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].err_unauthorized })
    const admin = await AdminModel.findOne({ _id: decoded._id }).populate({ path: 'iOrganizationId', select: ['sName'] }).populate({ path: 'iBranchId', select: ['sName'] }).lean()
    if (!admin) return res.status(status.Unauthorized).json({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].admin) })
    req.admin = admin
    return next()
  } catch (error) {
    return res.status(status.InternalServerError).json({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error })
  }
}

module.exports = {
  validate,
  isAdminAuthorized,
  checkRouteRateLimitStatus
}
