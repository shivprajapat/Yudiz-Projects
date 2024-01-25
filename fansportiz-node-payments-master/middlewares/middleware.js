/**
 * Auth middleware containes the common methods to authenticate user or admin by token.
 * @method {validateAdmin('MATCH','R')} is for authenticating the token and make sure its a admin.
 * @method {isUserAuthenticated} is for authenticating the token.
 * @method {findByToken} is specified in user.model.js
 */
const Sentry = require('@sentry/node')
const jwt = require('jsonwebtoken')
const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { messages, status, jsonStatus } = require('../helper/api.responses')
const { validationResult } = require('express-validator')
const config = require('../config/config')
const { PRIVATE_KEY } = require('../config/config')
const { findByToken, findRole, findByDepositToken } = require('./grpc/clientServices')
const { findUser } = require('../models-routes-services/userDeposit/grpc/clientServices')

const validateAdmin = (sKey, eType) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')
      if (!token) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      let admin
      try {
        admin = await findByToken(token)
      } catch (err) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      if (!admin) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      req.admin = admin

      let errors
      if (req.admin.eType === 'SUPER') {
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(status.UnprocessableEntity).jsonp({
            status: jsonStatus.UnprocessableEntity,
            errors: errors.array()
          })
        }

        return next(null, null)
      } else {
        if (!req.admin.aRole.length) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })

        const roles = findRole(req.admin.aRole)

        if (!roles.length) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })
        let aPermissions = roles.map(role => role.aPermissions)
        aPermissions = [].concat.apply([], aPermissions)
        const hasPermission = aPermissions.find((permission) => {
          return (
            permission.sKey === sKey &&
              (permission.eType === eType ||
                (eType === 'R' && permission.eType === 'W'))
          )
        })

        if (!hasPermission) {
          let hasSubAdminPermission
          if (sKey === 'DEPOSIT' && eType === 'W') {
            hasSubAdminPermission = roles.aPermissions.find((permission) => {
              return (
                permission.sKey === 'SYSTEM_USERS' && permission.eType === 'W'
              )
            })
          }
          if (!hasSubAdminPermission) {
            let message

            switch (eType) {
              case 'R':
                message = messages[req.userLanguage].read_access_denied.replace('##', sKey)
                break
              case 'W':
                message = messages[req.userLanguage].write_access_denied.replace('##', sKey)
                break
              case 'N':
                message = messages[req.userLanguage].access_denied
                break
              default:
                message = messages[req.userLanguage].access_denied
                break
            }

            return res.status(status.Unauthorized).jsonp({
              status: jsonStatus.Unauthorized,
              message
            })
          }
        }
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(status.UnprocessableEntity).jsonp({
            status: jsonStatus.UnprocessableEntity,
            errors: errors.array()
          })
        }

        return next(null, null)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
      return res.status(status.InternalServerError).jsonp({
        status: jsonStatus.InternalServerError,
        message: messages[req.userLanguage].error
      })
    }
  }
}

const isAdminAuthenticatedToDeposit = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const admin = await findByDepositToken(token)
    if (!admin) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    req.admin = admin

    return next(null, null)
  } catch (error) {
    if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

const validate = function (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors: errors.array() })
  }
  next()
}

const isUserAuthenticated = (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    req.user = {}
    let user
    try {
      user = jwt.verify(token, config.JWT_SECRET)
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    if (user.eType === 'B') {
      return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked })
    }
    req.user = user
    req.user._id = ObjectId(user._id)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(status.UnprocessableEntity).jsonp({
        status: jsonStatus.UnprocessableEntity,
        errors: errors.array()
      })
    }
    return next(null, null)
  } catch (error) {
    if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

const isBlockedByAdmin = async (req, res, next) => {
  try {
    const user = await findUser({ _id: req.user._id })
    if (!user || user.eStatus !== 'Y') { return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].user_blocked }) }

    return next(null, null)
  } catch (error) {
    if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

const decryption = function (password) {
  const decrypted = crypt.decrypt(PRIVATE_KEY, password)
  const decryptedData = decrypted.message
  return decryptedData.toString()
}
const decrypt = function (req, res, next) {
  const { sPassword, sOldPassword, sNewPassword } = req.body
  if (sPassword) {
    req.body.sPassword = decryption(sPassword)
  } else if (sOldPassword && sNewPassword) {
    req.body.sOldPassword = decryption(sOldPassword)
    req.body.sNewPassword = decryption(sNewPassword)
  } else if (!sOldPassword && sNewPassword) {
    req.body.sNewPassword = decryption(sNewPassword)
  }
  next()
}

const isCronAuthenticated = (req, res, next) => {
  try {
    if (config.CRON_AUTH_ENABLED) {
      const token = req.header('Authorization')

      if (!token || !config.CRON_AUTH_TOKEN || token !== config.CRON_AUTH_TOKEN) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
    }
    return next()
  } catch (error) {
    if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

module.exports = {
  validateAdmin,
  validate,
  isUserAuthenticated,
  decrypt,
  decryption,
  isBlockedByAdmin,
  isAdminAuthenticatedToDeposit,
  isCronAuthenticated
}
