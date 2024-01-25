// @ts-check
const AdminModel = require('./model')
const { status, messages, jsonStatus } = require('../../helper/api.response')
const { hashPassword, decryption, validPassword, catchError, pick, removenull, encodeToken, getPaginationValues } = require('../../helper/utilities.services')
const { JWT_EXPIRY, LOGIN_LIMIT } = require('../../config/config')
const OrganizationModel = require('../organization/model')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../operationLog/service')
const { operationName, operationCode } = require('../../data')
class Admin {
  async login (req, res) {
    try {
      req.body = pick(req.body, ['sEmail', 'sPassword'])
      removenull(req.body)

      const { sEmail, sPassword } = req.body
      const admin = await AdminModel.findOne({ sEmail })
      if (!admin) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      const decryptPassword = decryption(sPassword)
      const password = await validPassword(decryptPassword, admin.sPassword)
      if (!decryptPassword && !password) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].auth_failed })

      const sToken = encodeToken({ _id: admin._id.toString() }, JWT_EXPIRY)
      const newToken = { sToken }

      if (admin.aToken.length >= LOGIN_LIMIT) admin.aToken.shift()
      admin.aToken.push(newToken)

      await admin.save()
      admin.sPassword = undefined
      admin.__v = undefined
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body }, sOperationName: operationName?.ADMIN_LOGIN, sOperationType: operationCode?.READ })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].succ_login, sToken })
    } catch (error) {
      catchError('Admin.login', error, req, res)
    }
  };

  async getProfile (req, res) {
    const id = req?.query?.id ? req.query?.id : req?.admin?._id
    const userInfo = await AdminModel.findOne({ _id: id, eStatus: { $ne: 'D' } }, { sEmail: 1, sMobile: 1, sUserName: 1, iOrganizationId: 1, isAdmin: 1 }).populate({ path: 'iOrganizationId', select: ['sName', 'sLogo'] }).populate({ path: 'iBranchId', select: ['sName'] }).lean()
    if (!userInfo) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].admin) })
    return res.status(status.OK).json({ status: jsonStatus.OK, message: 'Profile Fetch Successfully', data: userInfo })
  }

  async createAdmin (req, res) {
    try {
      const { sEmail, sMobile, sUserName, sPassword, iBranchId, iOrganizationId } = req?.body
      const isAdminExists = await AdminModel.findOne({ $or: [{ sMobile: req.body.sMobile }, { sEmail: req.body.sEmail }], eStatus: { $ne: 'D' } }, { sMobile: 1, sEmail: 1, _id: 0 }).lean()
      if (isAdminExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].admin) })
      const [isOrganizationExists, isBranchExists] = await Promise.all([
        OrganizationModel.findOne({ _id: iOrganizationId, eStatus: 'Y', isBranch: false }, { _id: 1 }).lean(),
        OrganizationModel.findOne({ _id: iBranchId, eStatus: 'Y', isBranch: true }, { _id: 1 }).lean()
      ])
      if (!isOrganizationExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })
      if (!isBranchExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch) })
      const hashedPass = await hashPassword(sPassword)
      const insertBody = { sEmail, sMobile, sUserName, sPassword: hashedPass, iBranchId, iCreatedBy: req?.admin?._id, iOrganizationId }
      await AdminModel.create(insertBody)
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...insertBody }, sOperationName: operationName?.ADMIN_USER_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].admin) })
    } catch (error) {
      catchError('Admin.createAdmin', error, req, res)
    }
  };

  async deleteAdminUser (req, res) {
    try {
      const { id } = req?.params
      const updateResponse = await AdminModel.updateOne({ _id: id, eStatus: { $ne: 'D' } }, { $set: { eStatus: 'D' } })
      if (updateResponse?.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: id }, sOperationName: operationName?.ADMIN_USER_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].admin) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].admin) })
    } catch (error) {
      catchError('Admin.deleteAdmin', error, req, res)
    }
  }

  async updateAdminuser (req, res) {
    try {
      const id = req.query?.id ? req.query?.id : req?.admin?._id
      const { sUserName, sMobile, sEmail, iBranchId, iOrganizationId } = req?.body
      const isUserExists = await AdminModel.findOne({ _id: id, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isUserExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].admin) })
      const updateResponse = await AdminModel.updateOne({ _id: id }, { $set: { sUserName, sMobile, sEmail, iBranchId, iOrganizationId } })
      if (updateResponse?.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body }, sOperationName: operationName?.ADMIN_USER_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].admin) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].admin) })
    } catch (error) {
      catchError('Admin.updateAdmin', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { iBranchId } = req.query
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)
      const firstStage = { eStatus: { $ne: 'D' }, isAdmin: false }
      if (iBranchId)firstStage.iBranchId = new mongoose.Types.ObjectId(iBranchId)
      const projectStage = { sEmail: 1, sMobile: 1, sUserName: 1, iOrganizationId: 1, iBranchId: 1, 'oOrganization.sName': 1, 'oBranch.sName': 1 }
      const adminUsers = await AdminModel.aggregate([
        {
          $facet: {
            aUserList: [
              { $match: firstStage },
              {
                $lookup: {
                  from: 'organizations',
                  localField: 'iBranchId',
                  foreignField: '_id',
                  as: 'oBranch',
                  pipeline: [
                    {
                      $match: {
                        eStatus: { $ne: 'D' }
                      }
                    }
                  ]
                }
              },
              {
                $unwind: {
                  path: '$oBranch',
                  preserveNullAndEmptyArrays: true
                }
              },
              { $sort: sorting },
              { $skip: page },
              { $limit: limit },
              { $project: projectStage }
            ],
            total: [
              { $match: firstStage },
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aUserList: adminUsers[0].aUserList, count: adminUsers[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].admin), data })
    } catch (error) {
      catchError('AdminUser.list', error, req, res)
    }
  }
}

module.exports = new Admin()
