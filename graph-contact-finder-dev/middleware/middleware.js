// @ts-check
const { validationResult } = require('express-validator')
const { message, status } = require('../responses')
const config = require('../config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models-routes-controllers/user/model')
const Admin = require('../models-routes-controllers/admin/model')
const RolesModel = require('../models-routes-controllers/admin/roles/model')
const { responseMessage, catchError } = require('../helpers/utilityServices')
const { redisClient } = require('../helpers/redis')

// user validation
const validation = (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return responseMessage(req, res, 'BadRequest', 'ValidationFailed', '', { errors: errors.array() })
    }
    return next()
  } catch (error) {
    return catchError(req, res)
  }
}

const verifyIsUserAuthorized = async (req, res, next) => {
  const bearerHeader = req.headers.authorization

  if (!bearerHeader) return responseMessage(req, res, 'UnAuthorize', 'HeaderMissing', '')
  const bearer = bearerHeader.split(' ')
  const bearerToken = bearer[1]
  try {
    const authData = jwt.verify(bearerToken, config.JWT_SECRET_KEY)
    const isUserBlacklisted = await redisClient.get(`auth:${authData?.id}`)
    if (isUserBlacklisted) return responseMessage(req, res, 'UnAuthorize', 'NeedToLoginFirst', '')
    req.iCurrentUserId = authData?.id
    return next()
  } catch (error) {
    if (error.message === 'jwt expired') {
      return responseMessage(req, res, 'UnAuthorize', 'NeedToLoginFirst', '')
    } else {
      return catchError(req, res)
    }
  }
}

// user authentication
const verifyIsLoggedIn = async (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (!bearerHeader) return responseMessage(req, res, 'UnAuthorize', 'HeaderMissing', '')

  const bearer = bearerHeader.split(' ')
  const bearerToken = bearer[1]
  let authData, user

  try {
    authData = jwt.verify(bearerToken, config.JWT_SECRET_KEY)

    if (!authData) return responseMessage(req, res, 'NotFound', 'AuthorizationError', '')

    user = await User.findById(authData.id, { _id: 1, aJwtTokens: 1, eStatus: 1, sMobileNumber: 1, iDesignationId: 1, iProfessionId: 1 }).lean()

    if (!user) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')

    if (user.eStatus === 'B') return responseMessage(req, res, 'UnAuthorize', 'UserBlocked', '')

    if (user.eStatus === 'D') return responseMessage(req, res, 'NotFound', 'NotFound', 'User')

    const userToken = user.aJwtTokens

    if (userToken.findIndex(e => e.sToken === bearerToken) < 0) return responseMessage(req, res, 'BadRequest', 'NeedToLoginFirst', '')
  } catch (error) {
    if (error.message === 'jwt expired') {
      return responseMessage(req, res, 'UnAuthorize', 'NeedToLoginFirst', '')
    } else {
      return catchError(req, res)
    }
  }
  req.iCurrentUserId = authData.id
  req.sToken = bearerToken
  req.sCurrentMobileNumber = user.sMobileNumber
  req.currentUserInfo = user

  return next()
}

// admin authentication
const verifyIsAdminLoggedIn = async (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (!bearerHeader) return responseMessage(req, res, 'UnAuthorize', 'HeaderMissing', '')

  const bearer = bearerHeader.split(' ')
  const bearerToken = bearer[1]
  let authData
  try {
    authData = jwt.verify(bearerToken, config.JWT_SECRET_KEY)

    if (!authData) return responseMessage(req, res, 'NotFound', 'AuthorizationError', '')

    if (authData?.role !== 'admin') return responseMessage(req, res, 'UnAuthorize', 'YouCannotAccessThis', '')

    const admin = await Admin.findOne({ _id: authData?.id }, { _id: 1, aJwtTokens: 0 }).lean()

    if (!admin) return responseMessage(req, res, 'NotFound', 'NotFound', 'Admin')

    req.admin = authData?.id
    req.sToken = bearerToken
  } catch (error) {
    if (error.message === 'jwt expired') {
      return responseMessage(req, res, 'UnAuthorize', 'NeedToLoginFirst', '')
    } else {
      return catchError(req, res)
    }
  }
  return next()
}

const validateAdmin = (sKey, eType) => {
  return async (req, res, next) => {
    try {
      const bearerHeader = req.headers.authorization
      if (!bearerHeader) return responseMessage(req, res, 'UnAuthorize', 'HeaderMissing', '')

      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      const authData = jwt.verify(bearerToken, config.JWT_SECRET_KEY)
      if (authData?.role !== 'admin') return responseMessage(req, res, 'UnAuthorize', 'YouCannotAccessThis', '')

      const admin = await Admin.findOne({ _id: authData?.id }).lean()
      if (!admin) return responseMessage(req, res, 'NotFound', 'NotFound', 'Admin')

      const userToken = admin.aJwtTokens
      if (userToken.findIndex(e => e.sToken === bearerToken) < 0) return responseMessage(req, res, 'BadRequest', 'NeedToLoginFirst', '')

      req.admin = admin
      let errors
      if (req.admin.eType === 'SUPER') {
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          return responseMessage(req, res, 'BadRequest', 'ValidationFailed', '', { errors: errors.array() })
        }

        return next()
      } else {
        if (!req.admin.iRoleId) return responseMessage(req, res, 'UnAuthorize', 'AccessDenied', '')

        const role = await RolesModel.findOne({ _id: new mongoose.Types.ObjectId(req.admin.iRoleId), eStatus: 'Y' }, { aPermissions: 1 }).lean()
        if (!role) return responseMessage(req, res, 'UnAuthorize', 'AccessDenied', '')

        const hasPermission = role.aPermissions.find((permission) => {
          return (
            permission.sKey === sKey &&
                        (permission.eType === eType ||
                            (eType === 'R' && permission.eType === 'W'))
          )
        })

        if (!hasPermission) {
          let mes
          switch (eType) {
          case 'R':
            mes = message[req.userLanguage].ReadAccessDenied.replace('##', sKey)
            break
          case 'W':
            mes = message[req.userLanguage].WriteAccessDenied.replace('##', sKey)
            break
          case 'N':
            mes = message[req.userLanguage].AccessDenied
            break
          }
          return res.status(status.UnAuthorize).jsonp({
            status: status.UnAuthorize,
            message: mes
          })
        }
      }
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        return responseMessage(req, res, 'BadRequest', 'ValidationFailed', '')
      }

      return next()
    } catch (error) {
      if (error.message === 'jwt expired' || error.message === 'invalid signature') {
        return responseMessage(req, res, 'UnAuthorize', 'NeedToLoginFirst', '')
      } else {
        return catchError(req, res)
      }
    }
  }
}
module.exports = {
  validation,
  verifyIsLoggedIn,
  verifyIsAdminLoggedIn,
  validateAdmin,
  verifyIsUserAuthorized
}
