/* eslint-disable no-unused-vars */
const { status, jsonStatus, messages } = require('../helper/api.responses')
const { validationResult } = require('express-validator')

const EmployeeModel = require('../models_routes_service/Employee/model')
const ProjectModel = require('../models_routes_service/Project/model')
const PermissionModel = require('../models_routes_service/Permission/model')

const config = require('../config/config')
const jwt = require('jsonwebtoken')

const { isValidId, isValidNumber } = require('../helper/utilities.services')

const { supportedLanguage } = require('../data')

const Crypt = require('hybrid-crypto-js').Crypt
const crypt = new Crypt()

const setLanguage = (req, res, next) => {
  const lang = req.header('Language') || 'English'
  const languageIndex = supportedLanguage.indexOf(lang)

  if (languageIndex === -1) {
    req.userLanguage = 'English'
  } else {
    req.userLanguage = supportedLanguage[languageIndex]
  }

  return next()
}

const validate = function (req, res, next) {
  const lang = req.header('Language') || 'English'
  const languageIndex = supportedLanguage.indexOf(lang)

  if (languageIndex === -1) {
    req.userLanguage = 'English'
  } else {
    req.userLanguage = supportedLanguage[languageIndex]
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors: errors.array() })
  }
  next()
}

const isAuthenticated = async function (req, res, next) {
  // return next()
  try {
    const token = req.header('Authorization')
    const lang = req.header('Language') || 'English'
    if (lang === 'English') {
      req.userLanguage = 'English'
    }
    req.userLanguage = 'English'

    if (!(token)) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    let employee
    try {
      employee = jwt.verify(token, config.JWT_SECRET)
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const data = await EmployeeModel.findOne({ _id: employee._id, 'aJwtTokens.sToken': token })

    // console.log('data', JSON.stringify(data))

    if (!data) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    if (data.eStatus !== 'Y') {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }

    const permission = data.aTotalPermissions.map((item) => {
      return item.sKey
    })

    req.employee = { _id: data._id, sName: data.sName, eStatus: data.eStatus, eEmpType: data.eEmpType, dCreatedAt: data.dCreatedAt, aJwtTokens: data.aJwtTokens, sEmail: data.sEmail, aTotalPermissions: permission, iDepartmentId: data.iDepartmentId }
    // console.log('req.employee', req.employee)
    return next()
  } catch (error) {
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

const isOtherPermission = async function (req, res, next) {
  try {
    if (req.employee?.aTotalPermissions.includes('VIEW_COST')) req.employee.bViewCost = true
    else req.employee.bViewCost = false
    return next()
  } catch (error) {
    console.log(error)
  }
}

const isResetTokenCheck = async function (req, res, next) {
  try {
    const token = req.query.token
    const lang = req.header('Language') || 'English'
    const languageIndex = supportedLanguage.indexOf(lang)

    if (languageIndex === -1) {
      req.userLanguage = 'English'
    }
    req.userLanguage = 'English'

    if (!(token)) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    let employee
    try {
      employee = jwt.verify(token, config.JWT_SECRET)
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    const data = await EmployeeModel.findOne({ _id: employee._id, 'aJwtTokens.sToken': token })

    if (!data) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages[req.userLanguage].err_unauthorized
      })
    }
    req.employee = employee
    return next()
  } catch (error) {
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages[req.userLanguage].error
    })
  }
}

const decryption = function (password) {
  const decrypted = crypt.decrypt(config.PRIVATE_KEY, password)
  const decryptedData = decrypted.message
  return decryptedData.toString()
}

const decrypt = function (req, res, next) {
  const { sPassword } = req.body
  if (sPassword) {
    req.body.sPassword = decryption(sPassword)
  }
  next()
}

const decryptForChangePassword = function (req, res, next) {
  const { sNewPassword, sConfirmPassword, sCurrentPassword } = req.body

  if (sNewPassword && sConfirmPassword && sCurrentPassword) {
    req.body.sConfirmPassword = decryption(sConfirmPassword)
    req.body.sNewPassword = decryption(sNewPassword)
    req.body.sCurrentPassword = decryption(sCurrentPassword)
  }
  next()
}

const decryptForForgotPassword = function (req, res, next) {
  const { sNewPassword, sConfirmPassword } = req.body

  if (sNewPassword && sConfirmPassword) {
    req.body.sConfirmPassword = decryption(sConfirmPassword)
    req.body.sNewPassword = decryption(sNewPassword)
  }
  next()
}

const paginationValue = function (req, res, next) {
  const { page, limit } = req.query
  if (page === undefined || page === null || page === '') {
    req.query.page = 0
  }
  if (limit === undefined || limit === null || limit === '') {
    req.query.limit = 5
  }
  next()
}

const isAuthorized = function (permission) {
  // console.log('isAuthorized')

  return async function (req, res, next) {
    // console.log(req.route)
    // return next()
    try {
      console.log('permission from route set', permission)

      let prefix = permission.split('_')[0]

      if (permission === 'DOWNLOAD_EXCEL') {
        const { sModule } = req.body
        const permissionModule = {
          Employee: 'DOWNLOAD_EMPLOYEE_EXCEL',
          Project: 'DOWNLOAD_PROJECT_EXCEL',
          ProjectTag: 'DOWNLOAD_PROJECT_TAG_EXCEL',
          Skill: 'DOWNLOAD_SKILL_EXCEL',
          Department: 'DOWNLOAD_DEPARTMENT_EXCEL',
          Client: 'DOWNLOAD_CLIENT_EXCEL',
          WorkLogs: 'DOWNLOAD_WORKLOGS_EXCEL',
          ChangeRequest: 'DOWNLOAD_CHANGE_REQUEST_EXCEL',
          DashBoard: 'DOWNLOAD_DASHBOARD_EXCEL',
          Logs: 'DOWNLOAD_LOGS_EXCEL'
        }

        const permissionCheck = permissionModule[sModule]

        const permissions = await PermissionModel.findOne({ sPermission: permissionCheck, eStatus: 'Y', bIsActive: true }).lean()
        if (!permissions) {
          return res.status(status.PreConditionFailed).jsonp({
            status: jsonStatus.PreConditionFailed,
            message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].prefix),
            not_access_to: permission
          })
        }

        for (let i = 0; i < req.employee.aTotalPermissions.length; i++) {
          if (req.employee.aTotalPermissions[i] === permissionCheck) {
            // return next()
            return next()
          }
        }

        return res.status(status.PreConditionFailed).jsonp({
          status: jsonStatus.PreConditionFailed,
          message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].prefix),
          not_access_to: permission
        })
      } else if (permission === 'PROJECT') {
        if (req.body.flag === 1) {
          if (req.body?.iProjectId) {
            const permissions = await PermissionModel.findOne({ sPermission: 'UPDATE_PROJECT', eStatus: 'Y', bIsActive: true }).lean()
            if (!permissions) {
              return res.status(status.PreConditionFailed).jsonp({
                status: jsonStatus.PreConditionFailed,
                message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].UPDATE),
                not_access_to: permission
              })
            }
            const data = ProjectModel.findOne({ _id: req.body.iProjectId, eStatus: 'Y' }).lean()
            if (data) {
              if (req.employee.aTotalPermissions.includes('UPDATE_PROJECT')) {
                return next()
              }
            } else {
              prefix = 'UPDATE'
            }
          } else {
            const permissions = await PermissionModel.findOne({ sPermission: 'CREATE_PROJECT', eStatus: 'Y', bIsActive: true }).lean()
            if (!permissions) {
              return res.status(status.PreConditionFailed).jsonp({
                status: jsonStatus.PreConditionFailed,
                message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].CREATE),
                not_access_to: permission
              })
            }
            if (req.employee.aTotalPermissions.includes('CREATE_PROJECT')) {
              return next()
            } else {
              prefix = 'CREATE'
            }
          }
        }

        if (req.body.flag === 2) {
          const permissions = await PermissionModel.findOne({ sPermission: 'UPDATE_PROJECT', eStatus: 'Y', bIsActive: true }).lean()
          if (!permissions) {
            return res.status(status.PreConditionFailed).jsonp({
              status: jsonStatus.PreConditionFailed,
              message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].UPDATE),
              not_access_to: permission
            })
          }
          if (req.employee.aTotalPermissions.includes('UPDATE_PROJECT')) {
            return next()
          } else {
            prefix = 'UPDATE'
          }
        }

        if (req.body.flag === 3) {
          const permissions = await PermissionModel.findOne({ sPermission: 'UPDATE_PROJECT', eStatus: 'Y', bIsActive: true }).lean()
          if (!permissions) {
            return res.status(status.PreConditionFailed).jsonp({
              status: jsonStatus.PreConditionFailed,
              message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].UPDATE),
              not_access_to: permission
            })
          }
          if (req.employee.aTotalPermissions.includes('UPDATE_PROJECT')) {
            return next()
          } else {
            prefix = 'DELETE'
          }
        }
      } else {
        for (let i = 0; i < req.employee.aTotalPermissions.length; i++) {
          if (req.employee.aTotalPermissions[i] === permission) {
            return next()
          }
        }
      }

      const Obj = {
        message: messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage].do_action)
      }
      if (prefix === 'DOWNLOAD') {
        Obj.message = messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage][permission])
      }
      if (prefix === 'CREATE') {
        Obj.message = messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage][permission])
      }
      if (prefix === 'VIEW') {
        Obj.message = messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage][permission])
      }
      if (prefix === 'UPDATE') {
        Obj.message = messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage][permission])
      }
      if (prefix === 'DELETE') {
        Obj.message = messages[req.userLanguage].err_isAuthorization.replace('##', messages[req.userLanguage][permission])
      }

      return res.status(status.PreConditionFailed).jsonp({
        status: jsonStatus.PreConditionFailed,
        message: Obj.message,
        not_access_to: permission
      })
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({
        status: jsonStatus.InternalServerError,
        message: messages[req.userLanguage].error
      })
    }
  }
  // console.log(req)
}

module.exports = {
  setLanguage,
  validate,
  isAuthenticated,
  isResetTokenCheck,
  decrypt,
  decryption,
  decryptForChangePassword,
  decryptForForgotPassword,
  paginationValue,
  isAuthorized,
  isOtherPermission
}
