// @ts-check
const InquiryModel = require('../model')
const InquiryFollowupModel = require('./model')
const EmployeeModel = require('../../employee/model')
const { status, jsonStatus, messages } = require('../../../helper/api.response')
const { catchError, getPaginationValues } = require('../../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
class InquiryFollowup {
  async add (req, res) {
    try {
      const { nFollowupInDay, sResponse, iInquiryID, dFollowupAt, iFollowupBy } = req?.body
      const [isInquiryExists, isStaffUserExists] = await Promise.all([
        InquiryModel.findOne({ _id: iInquiryID, eStatus: { $ne: 'D' } }, { _id: 1 }).lean(),
        EmployeeModel.findOne({ _id: iFollowupBy, eUserType: 'S' }, { _id: 1 })
      ])
      if (!isStaffUserExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].employee) })
      if (!isInquiryExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      await InquiryFollowupModel.updateMany({ iInquiryID, eStatus: { $ne: 'D' } }, { $set: { eStatus: 'N' } })
      await InquiryFollowupModel.create({ nFollowupInDay, sResponse, iCreatedBy: req.admin?._id, iInquiryID, dFollowupAt, iFollowupBy })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].inquiryFollowup) })
    } catch (error) {
      catchError('Inquiry Followup.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const inquiry = await InquiryFollowupModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { __v: 0 }).lean()
      if (!inquiry) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].inquiryFollowup), inquiry })
    } catch (error) {
      catchError('Inquiry Followup.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const { nFollowupInDay, sResponse, iInquiryID, dFollowupAt, iFollowupBy } = req?.body
      const [isInquiryExists, isStaffUserExists] = await Promise.all([
        InquiryModel.findOne({ _id: iInquiryID, eStatus: { $ne: 'D' } }, { _id: 1 }).lean(),
        EmployeeModel.findOne({ _id: iFollowupBy, eUserType: 'S' }, { _id: 1 })
      ])
      if (!isStaffUserExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].employee) })
      if (!isInquiryExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      const inquiry = await InquiryFollowupModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { nFollowupInDay, sResponse, iCreatedBy: req.admin?._id, iInquiryID, dFollowupAt, iFollowupBy }, { runValidators: true })
      if (inquiry.modifiedCount) return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].inquiryFollowup) })
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiryFollowup) })
    } catch (error) {
      catchError('Inquiry Followup.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const findStage = { _id: req.params.id, eStatus: { $ne: 'D' } }
      const updateStage = { eStatus: 'D' }
      const options = { runValidators: true }
      const inquiry = await InquiryFollowupModel.updateOne(findStage, updateStage, options)
      if (inquiry.modifiedCount) return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].inquiryFollowup) })
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiryFollowup) })
    } catch (error) {
      catchError('Inquiry Followup.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { id, iFollowupBy, nextFollowupListDayBefore = 0 } = req?.query
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)
      const firstStage = { eStatus: { $ne: 'D' } }
      if (id)firstStage.iInquiryID = new mongoose.Types.ObjectId(id)
      if (iFollowupBy)firstStage.iFollowupBy = new mongoose.Types.ObjectId(iFollowupBy)
      if (nextFollowupListDayBefore)firstStage.$and = [{ nextFollowupAt: { $lte: new Date() } }, { eStatus: 'Y' }]
      const projectStage = { eStatus: 1, nextFollowupAt: 1, iFollowupBy: 1, iInquiryID: 1, sResponse: 1, dCreatedDate: 1, dUpdatedDate: 1, nFollowupInDay: 1, dFollowupAt: 1, 'oFollowupBy.sName': 1, 'oFollowupBy._id': 1 }
      const queryStage = [
        {
          $addFields: {
            nextFollowupAt: {
              $add: [
                '$dFollowupAt',
                { $multiply: [(24 * 60 * 60 * 1000), { $add: ['$nFollowupInDay', -nextFollowupListDayBefore] }] }
              ]
            }
          }
        },
        {
          $addFields: {
            nextFollowupAt: {
              $dateFromParts: {
                year: { $year: '$nextFollowupAt' },
                month: { $month: '$nextFollowupAt' },
                day: { $dayOfMonth: '$nextFollowupAt' },
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
              }
            }
          }
        },
        {
          $match: firstStage
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'iFollowupBy',
            foreignField: '_id',
            as: 'oFollowupBy'
          }
        },
        {
          $unwind: {
            path: '$oFollowupBy',
            preserveNullAndEmptyArrays: true
          }
        }
      ]
      const inquiryList = await InquiryFollowupModel.aggregate([
        {
          $facet: {
            aInquiryFollowupList: [
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
      const data = { aInquiryFollowupList: inquiryList[0]?.aInquiryFollowupList, count: inquiryList[0]?.total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].inquiryFollowup), data })
    } catch (error) {
      catchError('Inquiry Followup.list', error, req, res)
    }
  }
}

module.exports = new InquiryFollowup()
