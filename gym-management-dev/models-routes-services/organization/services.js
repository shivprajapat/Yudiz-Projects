// @ts-check
const OrganizationModel = require('./model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { pick, catchError, getPaginationValues } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const { addLog } = require('../operationLog/service')

class Organization {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sLocation', 'sLogo', 'sMobile', 'sSecondaryMobile', 'iOrganizationId', 'isBranch', 'sEmail'])
      if (req.body?.iOrganizationId) {
        const isOrganizationExists = await OrganizationModel.findOne({ _id: req?.body?.iOrganizationId, eStatus: 'Y' }, { _id: 1 }).lean()
        if (!isOrganizationExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })
      } else {
        const isOrganizationExists = await OrganizationModel.findOne({ isBranch: false, eStatus: 'Y' }, { _id: 1 }).lean()
        if (isOrganizationExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].organization) })
      }
      await OrganizationModel.create({ ...req.body, isBranch: !!req?.body?.iOrganizationId })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body, _id: req?.admin?._id }, sOperationName: operationName?.BRANCH_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', req.body?.iOrganizationId ? messages[req.userLanguage].branch : messages[req.userLanguage].organization) })
    } catch (error) {
      catchError('Organization.Add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const organization = await OrganizationModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { __v: 0 }).populate({ path: 'iOrganizationId', select: ['sName'] }).lean()
      if (!organization) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })

      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), organization })
    } catch (error) {
      catchError('Organization.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sLogo', 'sMobile', 'sSecondaryMobile', 'iOrganizationId', 'sLocation', 'isBranch', 'sEmail'])
      const organization = await OrganizationModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!organization) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })
      const updateResponse = await OrganizationModel.updateOne({ _id: req.params.id }, { ...req.body }, { runValidators: true })
      if (updateResponse?.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body, _id: req.params.id }, sOperationName: operationName?.BRANCH_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].organization) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', req.body?.iOrganizationId ? messages[req.userLanguage].branch : messages[req.userLanguage].organization) })
    } catch (error) {
      catchError('Organization.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const organization = await OrganizationModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!organization) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })
      const updateResponse = await OrganizationModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (updateResponse.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id }, sOperationName: operationName?.BRANHC_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].organization) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })
    } catch (error) {
      catchError('Organization.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)
      const projectFields = {
        __v: 0
      }
      const firstStage = { eStatus: { $ne: 'D' } }
      if (req?.query?.isBranch)firstStage.isBranch = req?.query.isBranch
      const [aOrganizationList, count] = await Promise.all([
        OrganizationModel.find(firstStage, projectFields).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(),
        OrganizationModel.countDocuments(firstStage)
      ])
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].organization), data: { aOrganizationList, count } })
    } catch (error) {
      catchError('Organization.list', error, req, res)
    }
  }
}
module.exports = new Organization()
