// @ts-check
const { catchError, getPaginationValues, adminLog, getIp, responseMessage, savePushNotification, removeNull } = require('../../../helpers/utilityServices')
const AdminsModel = require('../model')
const RolesModel = require('../roles/model')
const mongoose = require('mongoose')
const crypto = require('crypto')
// const { pushNotification } = require('../../../helpers/firebase.services')
const { message } = require('../../../responses')
const { adminLogOperationName } = require('../../../enums')

class SubAdmin {
  async list (req, res) {
    try {
      const { nPage, nLimit, oSorting, sSearch } = getPaginationValues(req.query)
      const { eField, eDesignation } = req.query
      let query = {}

      if (sSearch) {
        query = {
          $or: [
            { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
            { sMobileNumber: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
          ]
        }
      }
      query = { ...query, eType: 'SUB', eField, eDesignation }
      removeNull(query)

      const nTotalCount = await AdminsModel.countDocuments(query)

      if (!nTotalCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'SubAdmin')

      const aList = await AdminsModel.find(query, { sName: 1, sMobileNumber: 1, eField: 1, eDesignation: 1, eStatus: 1, iRoleId: 1 })
        .sort(oSorting)
        .skip((nPage - 1) * nLimit)
        .limit(nLimit)
        .lean()

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'SubAdmin', { total: nTotalCount, list: aList })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async get (req, res) {
    try {
      const data = await AdminsModel.findOne({ _id: new mongoose.Types.ObjectId(req.params.id), eType: 'SUB' }, { sName: 1, sMobileNumber: 1, eStatus: 1, eField: 1, eDesignation: 1 }).lean()

      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'SubAdmin')

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'SubAdmin', { SubAdmins: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async updateSubAdmin (req, res) {
    try {
      const { sMobileNumber, iRoleId, sPassword } = req.body
      if (sPassword) req.body.sPassword = crypto.createHash('sha512').update(sPassword).digest('hex')

      let role
      if (iRoleId) {
        role = await RolesModel.findOne({ _id: new mongoose.Types.ObjectId(iRoleId), eStatus: 'Y' }).lean()
        if (!role) return responseMessage(req, res, 'NotFound', 'NotFound', 'Role')
      }

      const oOldFields = await AdminsModel.findById(req.params.id, { sName: 1, sMobileNumber: 1, iRoleId: 1, aJwtTokens: 1 }).lean()

      const data = await AdminsModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id), eType: 'SUB' }, { ...req.body }, { new: true, runValidators: true }).lean()

      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'SubAdmin')

      const adminExist = await AdminsModel.findOne({ sMobileNumber, _id: { $ne: req.params.id } })

      if (adminExist) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'MobileNumber')

      const { _id: iAdminId } = req.admin
      const oNewFields = { ...oOldFields, ...req.body }
      const logData = { oOldFields, oNewFields, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(iAdminId), eOperationType: 'U', sOperationName: adminLogOperationName?.SAU }
      await adminLog(req, res, logData)

      AdminsModel.filterData(data)

      const [registrationToken] = oOldFields.aJwtTokens.slice(-1)
      const sTitle = 'Profile Updated'
      const sBody = message.English.YourProfileUpdatedByAdmin

      if (registrationToken && registrationToken.sPushToken) {
        // await pushNotification(registrationToken.sPushToken, sTitle, sBody)
        await savePushNotification({ iAdminId: req.admin._id, sUserToken: registrationToken.sPushToken, sTitle, sDescription: sBody })
      }

      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'SubAdmin', { admin: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async getAdminIds (req, res) {
    try {
      const data = await AdminsModel.find({ eType: 'SUB' }, { sName: 1 }).lean()
      if (!data.length) return responseMessage(req, res, 'NotFound', 'NotFound', 'SubAdmin')
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'SubAdmin', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new SubAdmin()
