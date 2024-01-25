// @ts-check
const RolesModel = require('./model')
const PermissionsModel = require('../permissions/model')
const { removeNull, pick, catchError, getPaginationValues, getIp, adminLog, responseMessage } = require('../../../helpers/utilityServices')
const mongoose = require('mongoose')
const { adminLogOperationName } = require('../../../enums')

class Role {
  // add the new roles
  async add (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'aPermissions', 'eStatus'])
      removeNull(req.body)

      const { aPermissions, sName } = req.body

      const isExist = await RolesModel.findOne({ sName }, { _id: 0, sName: 1 }).lean()

      if (isExist) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'Role')

      const eKeyArray = aPermissions.map(({ sKey }) => sKey)
      const aDbPermissions = await PermissionsModel.find({ sStatus: 'Y' }, { sKey: 1, _id: 0 }).lean()

      if (!aDbPermissions.length) return responseMessage(req, res, 'NotFound', 'NotFound', 'Permissions')

      // now we will check that all permissions include in our db are exists in our given permissions
      const aIsValid = aDbPermissions.every(({ sKey }) => eKeyArray.includes(sKey))

      if (!aIsValid) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Permissions')
      const logData = { oOldFields: {}, oNewFields: req.body, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req?.admin?._id), eOperationType: 'C', sOperationName: adminLogOperationName?.CR }
      await adminLog(req, res, logData)
      const data = await RolesModel.create(req.body)

      return responseMessage(req, res, 'Success', 'AddedSuccessfully', 'Role', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  // get the list of status= 'yes' roles
  async list (req, res) {
    try {
      const data = await RolesModel.find({ eStatus: 'Y' }, { __v: 0 }).lean()

      if (!data.length) return responseMessage(req, res, 'NotFound', 'NotFound', 'Roles')

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Roles', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async adminList (req, res) {
    try {
      let { nPage, nLimit, oSorting, sSearch } = getPaginationValues(req.query)
      nPage = parseInt(nPage)
      nLimit = parseInt(nLimit)

      const query = {}
      if (sSearch) { query.sName = { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }

      const nTotalCount = await RolesModel.countDocuments(query)

      if (!nTotalCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'Roles')

      const data = await RolesModel.find(query).sort(oSorting).skip((nPage - 1) * nLimit).limit(nLimit).lean()

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Roles', { total: nTotalCount, Roles: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async getRole (req, res) {
    try {
      const data = await RolesModel.findById(req.params.id, { __v: 0 }).lean()

      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'Role')

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Role', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async updateRole (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'aPermissions', 'eStatus'])
      removeNull(req.body)
      const { aPermissions, sName } = req.body

      const isExist = await RolesModel.findOne({ sName, _id: { $ne: req.params.id } })

      if (isExist) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'Role')

      const eKeyArray = aPermissions.map(({ sKey }) => sKey)
      const aDbPermissions = await PermissionsModel.find({ eStatus: 'Y' }, { sKey: 1, _id: 0 }).lean()

      if (!aDbPermissions.length) return responseMessage(req, res, 'NotFound', 'NotFound', 'Permissions')

      // now we will check that all permissions include in our db are exists in our given permissions
      const aIsValid = aDbPermissions.every(({ sKey }) => eKeyArray.includes(sKey))

      if (!aIsValid) return responseMessage(req, res, 'BadRequest', 'InvalidEntry', 'Permissions')

      const oOldFields = await RolesModel.findById(req.params.id, { __v: 0 })
      if (!oOldFields) return responseMessage(req, res, 'NotFound', 'NotFound', 'Role')

      const data = await RolesModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

      const { _id: iAdminId } = req.admin
      const oNewFields = { ...oOldFields, ...req.body }
      const logData = { oOldFields, oNewFields, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(iAdminId), eOperationType: 'U', sOperationName: adminLogOperationName?.RU }
      await adminLog(req, res, logData)

      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Role', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async deleteRole (req, res) {
    try {
      const data = await RolesModel.findByIdAndDelete(req.params.id).lean()
      const { _id: iAdminId } = req.admin
      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'Role')
      const logData = { oOldFields: {}, oNewFields: { _id: req.params.id }, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(iAdminId), eOperationType: 'D', sOperationName: adminLogOperationName?.RD }
      await adminLog(req, res, logData)
      return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'Role')
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new Role()
