// @ts-check
const AdminsModel = require('../model')
const RolesModel = require('../roles/model')
const { pick, removeNull, catchError, jwtSign, getIp, responseMessage, savePushNotification } = require('../../../helpers/utilityServices')
const mongoose = require('mongoose')
const crypto = require('crypto')
const AdminAuthLogsModel = require('../authlogs.model')
const config = require('../../../config')
// const { subscribeUser, pushTopicNotification } = require('../../../helpers/firebase.services')
const { message } = require('../../../responses')

class AdminAuth {
  // login admin
  async login (req, res) {
    try {
      const { sMobileNumber, sPassword, sDeviceToken } = req.body
      const sHashedPassword = crypto.createHash('sha512').update(sPassword).digest('hex')
      const admin = await AdminsModel.findOne({ sMobileNumber }, { bIsUser: 1, sPassword: 1, aJwtTokens: 1 })

      if (!admin) return responseMessage(req, res, 'NotFound', 'NotFound', 'Admin')

      if (admin.sPassword !== sHashedPassword) return responseMessage(req, res, 'Forbidden', 'IncorrectPassword', '')

      const newToken = jwtSign({ id: admin._id, role: 'admin' }, config.JWT_VALIDITY)

      const sPushToken = req.headers.spushtoken
      if (sPushToken) newToken.sPushToken = sPushToken

      if (admin.aJwtTokens.length >= config.LOGIN_HARD_LIMIT_ADMIN) {
        admin.aJwtTokens.shift()
        admin.aJwtTokens.push(newToken)
      } else {
        admin.aJwtTokens.push(newToken)
      }

      await AdminsModel.findByIdAndUpdate(admin._id, { aJwtTokens: admin.aJwtTokens, dLoginAt: new Date() })

      // if (sPushToken) await subscribeUser(sPushToken, 'admin')

      const ePlatform = ['A', 'I', 'W'].includes(req.header('Platform')) ? req.header('Platform') : 'O'

      await AdminAuthLogsModel.create({ iAdminId: admin._id, ePlatform, eType: 'L', sDeviceToken, sIpAddress: getIp(req) })

      return responseMessage(req, res, 'Success', 'LoginSuccessfully', '', { jwt_token: newToken.sToken })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async createSubAdmin (req, res) {
    req.body = pick(req.body, ['iRoleId', 'sName', 'sMobileNumber', 'sPassword', 'eField', 'eDesignation'])
    removeNull(req.body)
    const { iRoleId, sMobileNumber, sPassword, sName } = req.body
    req.body.sPassword = crypto.createHash('sha512').update(sPassword).digest('hex')

    // only super admin has the permit of creating sub admin
    if (req.admin.eType !== 'SUPER') return responseMessage(req, res, 'UnAuthorize', 'AccessDenied', '')

    // We'll check that role that is to be assigned to sub admin is active or not.
    const role = await RolesModel.findOne({ _id: new mongoose.Types.ObjectId(iRoleId), eStatus: 'Y' }).lean()

    if (!role) return responseMessage(req, res, 'NotFound', 'NotFound', 'Role')

    const oAdminData = await AdminsModel.findOne({ sMobileNumber }).lean()

    if (oAdminData) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'SubAdmin')

    await AdminsModel.create({ ...req.body, eType: 'SUB' })

    const sTopic = 'admin'
    const sTitle = 'Hello Admins👋 '
    const sBody = message.English.OneSubAdminAdded.replace('##', sName)
    // await pushTopicNotification(sTopic, sTitle, sBody)
    await savePushNotification({ iAdminId: req.admin._id, sTopic, sTitle, sDescription: sBody })

    return responseMessage(req, res, 'Success', 'AddedSuccessfully', 'SubAdmin')
  }

  async logout (req, res) {
    try {
      await AdminsModel.findByIdAndUpdate(req.admin, { $pull: { aJwtTokens: { sToken: req.sToken } } })
      return responseMessage(req, res, 'Success', 'LoggedOutSuccessfully', '')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async createAdmin (req, res) {
    req.body = pick(req.body, ['sName', 'sMobileNumber', 'sPassword', 'eType'])
    req.body.sPassword = crypto.createHash('sha512').update(req.body.sPassword).digest('hex')
    const isAdminExists = await AdminsModel.findOne({ sMobileNumber: req?.body?.sMobileNumber })
    if (isAdminExists) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'Admin')
    await AdminsModel.create(req.body)
    return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'Admin')
  }
}

module.exports = new AdminAuth()
