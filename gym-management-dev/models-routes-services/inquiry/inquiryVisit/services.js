// @ts-check
const InquiryModel = require('../model')
const InquiryVisitModel = require('./model')
const { status, jsonStatus, messages } = require('../../../helper/api.response')
const { catchError, getPaginationValues } = require('../../../helper/utilities.services')
const { default: mongoose } = require('mongoose')

class InquiryVisit {
  async add (req, res) {
    try {
      const { iInquiryID, dVisitedAt, sPurpose, sDescription } = req?.body
      const isInquiryExists = await InquiryModel.findOne({ _id: iInquiryID, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isInquiryExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      await Promise.all([
        InquiryVisitModel.create({ iCreatedBy: req.admin?._id, iInquiryID, dVisitedAt, sPurpose, sDescription }),
        InquiryModel.updateOne({ _id: new mongoose.Types.ObjectId(iInquiryID) }, { $inc: { nVisitCount: 1 } })
      ])
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].inquiryVisit) })
    } catch (error) {
      catchError('InquiryVisit.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const inquiryVisit = await InquiryVisitModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { __v: 0 }).lean()
      if (!inquiryVisit) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiryVisit) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].inquiryVisit), inquiryVisit })
    } catch (error) {
      catchError('InquiryVisit.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const { iInquiryID, dVisitedAt, sPurpose, sDescription } = req?.body
      const isInquiryExists = await InquiryModel.findOne({ _id: iInquiryID, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isInquiryExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })

      const inquiryVisit = await InquiryVisitModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { iInquiryID, dVisitedAt, sPurpose, sDescription }, { runValidators: true })
      if (inquiryVisit.modifiedCount) return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].inquiryVisit) })
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiryVisit) })
    } catch (error) {
      catchError('InquiryVisit.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const { id, inquiryId } = req?.query
      const isInquiryExists = await InquiryModel.findOne({ _id: inquiryId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isInquiryExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiry) })
      const findStage = { _id: id, eStatus: { $ne: 'D' } }
      const updateStage = { eStatus: 'D' }
      const options = { runValidators: true }
      const [inquiryVisitUpdateResponse, inquiryUpdateResponse] = await Promise.all([
        InquiryVisitModel.updateOne(findStage, updateStage, options),
        InquiryModel.updateOne({ _id: inquiryId }, { $inc: { nVisitCount: -1 } })
      ])
      if (inquiryVisitUpdateResponse?.modifiedCount && inquiryUpdateResponse?.modifiedCount) return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].inquiryVisit) })
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].inquiryVisit) })
    } catch (error) {
      catchError('InquiryVisit.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { id } = req?.query
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)

      const firstStage = { eStatus: { $ne: 'D' } }
      if (id)firstStage.iInquiryID = new mongoose.Types.ObjectId(id)
      const projectStage = { iInquiryID: 1, sResponse: 1, dCreatedDate: 1, dUpdatedDate: 1, sPurpose: 1, sDescription: 1, dVisitedAt: 1, 'oCreator.sUserName': 1, 'oCreator._id': 1 }
      const queryStage = [
        {
          $match: firstStage
        },
        {
          $lookup: {
            from: 'admins',
            localField: 'iCreatedBy',
            foreignField: '_id',
            as: 'oCreator'
          }
        },
        {
          $unwind: {
            path: '$oCreator',
            preserveNullAndEmptyArrays: true
          }
        }
      ]

      const inquiryVisitList = await InquiryVisitModel.aggregate([
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

      const data = { aInquiryVisitList: inquiryVisitList[0]?.aInquiryFollowupList, count: inquiryVisitList[0]?.total[0]?.total || 0 }

      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].inquiryVisit), data })
    } catch (error) {
      catchError('InquiryVisit.list', error, req, res)
    }
  }
}

module.exports = new InquiryVisit()
