/**
 * Auth middleware containes the common methods to authenticate user or admin by token.
 * @method {validateAdmin('MATCH','R')} is for authenticating the token and make sure its a admin.
 * @method {isUserAuthenticated} is for authenticating the token.
 * @method {findByToken} is specified in user.model.js
 */
const Sentry = require('@sentry/node')
const jwt = require('jsonwebtoken')
var Crypt = require('hybrid-crypto-js').Crypt
var crypt = new Crypt()
const { messages, status, jsonStatus } = require('../helper/api.responses')
const { validationResult } = require('express-validator')
const config = require('../config/config-file')
const { PRIVATE_KEY } = require('../config/config-file')
const StudentsModel = require('../models-routes-services/student/auth/student.model')
const CounsellorModel = require('../models-routes-services/counsellor/counsellor.model')
const AdminModel = require('../models-routes-services/admin/auth/admin.model')
const CenterModel = require('../models-routes-services/center/Auth/center.model')

const setLanguage = (req, res, next) => {
  const lang = req.header('Language')
  if (lang === 'English') {
    req.userLanguage = 'English'
  }
  req.userLanguage = 'English'

  return next(null, null)
}

const validate = function (req, res, next) {
  if (!req.body.updateType) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(status.UnprocessableEntity)
        .jsonp({ status: jsonStatus.UnprocessableEntity, errors: errors.array() })
    }
  }
  next()
}

const isStudentAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    await jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
    })
    req.user = {}
    let decodedToken
    try {
      decodedToken = jwt.decode(token, config.JWT_SECRET)

      if (!decodedToken) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const user = await StudentsModel.findOne({ raw: true, where: { id: decodedToken._id, token: token } })

    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    req.user = user
    req.user.id = user.id

    return next(null, null)
  } catch (error) {
    Sentry.captureMessage(error)
    return res.status(status.Unauthorized).jsonp({
      status: jsonStatus.Unauthorized,
      message: messages[req.userLanguage].err_unauthorized
    })
  }
}

const isAdminAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    req.user = {}
    let decodedToken
    try {
      decodedToken = jwt.decode(token, config.JWT_SECRET)
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const user = await AdminModel.findOne({ where: { email: decodedToken._id, token: token } })
    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    req.user = user
    req.user.id = user.id
    return next(null, null)
  } catch (error) {
    Sentry.captureMessage(error)
    return res.status(status.Unauthorized).jsonp({
      status: jsonStatus.Unauthorized,
      message: messages[req.userLanguage].err_unauthorized
    })
  }
}
const isCenterAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    req.user = {}
    let decodedToken
    try {
      decodedToken = jwt.decode(token, config.JWT_SECRET)
      if (!decodedToken) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const user = await CenterModel.findOne({ raw: true, where: { email: decodedToken._id, token: token } })
    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    req.user = user
    req.user.id = user.id
    return next(null, null)
  } catch (error) {
    Sentry.captureMessage(error)
    return res.status(status.Unauthorized).jsonp({
      status: jsonStatus.Unauthorized,
      message: messages[req.userLanguage].err_unauthorized
    })
  }
}

const isCounsellorAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    await jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
    })
    req.user = {}
    let decodedToken
    try {
      decodedToken = jwt.decode(token, config.JWT_SECRET)

      if (!decodedToken) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const user = await CounsellorModel.findOne({ raw: true, where: { email: decodedToken._id, token: token } })

    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    req.user = user
    req.user.id = user.id

    return next(null, null)
  } catch (error) {
    Sentry.captureMessage(error)
    return res.status(status.Unauthorized).jsonp({
      status: jsonStatus.Unauthorized,
      message: messages[req.userLanguage].err_unauthorized
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

const validateFunctionality = (functionality) => {
  return async function (req, res, next) {
    if (config.FUNCTIONALITY[functionality]) {
      return next(null, null)
    } else {
      return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })
    }
  }
}

const changeDeviceTokenField = function (req, res, next) {
  if (req.body) {
    const { sDeviceId } = req.body

    req.body.sDeviceToken = sDeviceId
  }

  next()
}
module.exports = {
  setLanguage,
  validate,
  isStudentAuthenticated,
  isAdminAuthenticated,
  isCenterAuthenticated,
  isCounsellorAuthenticated,
  decrypt,
  decryption,
  validateFunctionality,
  changeDeviceTokenField
}
