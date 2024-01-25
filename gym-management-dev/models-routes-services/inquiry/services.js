// @ts-check
const InquiryModel = require('./model')
const OrganizationModel = require('../organization/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, pick, getPaginationValues } = require('../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { operationName, operationCode } = require('../../data')
const { addLog } = require('../operationLog/service')

class Inquiry {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['sPurpose', 'sDescription', 'sPreferredLocation', 'sName', 'sEmail', 'sPhone', 'dFollowupDate', 'dInquiryAt', 'sSecondaryPhone', 'iBranchId'])
      const inquiryMatchStage = [{ sPhone: req?.body?.sPhone }]
      if (req?.body?.sSecondaryPhone)inquiryMatchStage.push({ sSecondaryPhone: req?.body?.sSecondaryPhone })
      if (req.body.email)inquiryMatchStage?.push({ sEmail: req.body.email })
      const [isInquiryExists, isBranchExists] = await Promise.all([
        InquiryModel.findOne({ $or: inquiryMatchStage, eStatus: { $ne: 'D' } }, { _id: 1 }).lean(),
        OrganizationModel.findOne({ _id: req.body.iBranchId }, { _id: 1 }).lean()
      ])
      if (isInquiryExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].inquiry) })
      if (!isBranchExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch) })
      const insertBody = { ...req.body, iCreatedBy: req.admin?._id }
      await InquiryModel.create({ ...req.body, iCreatedBy: req.admin?._id })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...insertBody }, sOperationName: operationName?.INQUIRY_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].inquiry) })
    } catch (error) {
      catchError('Inquiry.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const { sPhone, id } = req?.query
      const queryStage = {
        eStatus: { $ne: 'D' }
      }
      if (sPhone) {
        queryStage.$or = [
          { sPhone },
          { sSecondaryPhone: sPhone }
        ]
      }
      if (id) queryStage._id = id
      const inquiry = await InquiryModel.findOne(queryStage).populate({ path: 'iBranchId', select: ['sName'] }).populate({ path: 'iCreatedBy', select: ['sUserName'] }).lean()
      if (!inquiry) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].inquiry), inquiry })
    } catch (error) {
      catchError('Inquiry.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['sPurpose', 'sDescription', 'sPreferredLocation', 'sName', 'sEmail', 'sPhone', 'dFollowupDate', 'dInquiryAt', 'iBranchId'])
      const [isInquiryExists, isBranchExists] = await Promise.all([
        InquiryModel.findOne({ _id: req.params?.id, eStatus: { $ne: 'D' } }, { _id: 1 }).lean(),
        OrganizationModel.findOne({ _id: req.body.iBranchId }, { _id: 1 }).lean()
      ])
      if (!isInquiryExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      if (!isBranchExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch) })
      const inquiry = await InquiryModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { ...req.body }, { runValidators: true })
      if (inquiry.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id, ...req.body }, sOperationName: operationName?.INQUIRY_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].inquiry) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
    } catch (error) {
      catchError('Inquiry.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const findStage = { _id: req.params.id, eStatus: { $ne: 'D' } }
      const updateStage = { eStatus: 'D' }
      const options = { runValidators: true }
      const inquiry = await InquiryModel.updateOne(findStage, updateStage, options)
      if (inquiry.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id }, sOperationName: operationName?.INQUIRY_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].inquiry) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
    } catch (error) {
      catchError('Inquiry.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { eStatus, iBranchId } = req.query
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const firstStage = { eStatus: { $ne: 'D' } }
      if (eStatus) firstStage.eStatus = eStatus
      if (iBranchId) firstStage.iBranchId = new mongoose.Types.ObjectId(iBranchId)

      const searchStage = search?.length
        ? {
            $or: [
              {
                sDescription: { $regex: search, $options: 'i' }
              },
              {
                sName: { $regex: search, $options: 'i' }
              },
              {
                sPhone: { $regex: search, $options: 'i' }
              },
              {
                sEmail: { $regex: search, $options: 'i' }
              }
            ]
          }
        : {}
      const projectStage = { iBranchId: 1, sPurpose: 1, sDescription: 1, sPreferredLocation: 1, sName: 1, sEmail: 1, sPhone: 1, sSecondaryPhone: 1, nVisitCount: 1, iCreatedBy: 1, 'oBranch.sName': 1, 'oBranch._id': 1, eStatus: 1, dCreatedDate: 1, dUpdatedDate: 1, dInquiryAt: 1, dFollowupDate: 1 }
      const queryStage = [
        {
          $match: firstStage
        },
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
        {
          $match: searchStage
        }
      ]

      const inquiryList = await InquiryModel.aggregate([
        {
          $facet: {
            aInquiryList: [
              ...queryStage,
              { $sort: sorting },
              { $skip: page },
              { $limit: limit },
              { $project: projectStage }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])

      const data = { aInquiryList: inquiryList[0]?.aInquiryList, count: inquiryList[0]?.total[0]?.total || 0 }

      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].inquiry), data })
    } catch (error) {
      catchError('Inquiry.list', error, req, res)
    }
  }
}

module.exports = new Inquiry()
