// @ts-check
const PermissionModel = require('./model')
const RolesModel = require('../roles/model')
const { pick, removeNull, catchError, responseMessage, getIp, adminLog } = require('../../../helpers/utilityServices')
const mongoose = require('mongoose')
const { adminLogOperationName } = require('../../../enums')

class Permissions {
  // to add the permission
  async addPermission (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sKey', 'eStatus'])
      removeNull(req.body)
      const { sKey } = req.body
      const permissionExist = await PermissionModel.findOne({ sKey }).lean()

      if (permissionExist) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'Permission')

      const data = await PermissionModel.create(req.body)

      // We'll update all roles with assigning new permissions of none(Not Read + Not Write) rights
      await RolesModel.updateMany({}, { $push: { aPermissions: { sKey, eType: 'N' } } }, { runValidators: true })

      return responseMessage(req, res, 'Success', 'AddedSuccessfully', 'Permission', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // to get the list of permissions
  async list (req, res) {
    try {
      const data = await PermissionModel.find({ eStatus: 'Y' }, { __v: 0 }).lean()
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Permissions', { Permissions: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async adminList (req, res) {
    try {
      const data = await PermissionModel.find().lean()

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Permissions', { Permissions: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // get the the specific permissions by given id
  async get (req, res) {
    try {
      const data = await PermissionModel.findById(req.params.id, { __v: 0 }).lean()

      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'Permission')

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Permission', { Permission: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // update the specific permission by given id
  async update (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sKey', 'eStatus'])

      const oOldFields = await PermissionModel.findById(req.params.id, { __v: 0 })
      if (!oOldFields) return responseMessage(req, res, 'NotFound', 'NotFound', 'Permission')

      const data = await PermissionModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

      const { _id: iAdminId } = req.admin
      const oNewFields = { ...oOldFields, ...req.body }
      const logData = { oOldFields, oNewFields, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(iAdminId), eOperationType: 'U', sOperationName: adminLogOperationName?.PU }
      await adminLog(req, res, logData)

      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Permission', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new Permissions()
