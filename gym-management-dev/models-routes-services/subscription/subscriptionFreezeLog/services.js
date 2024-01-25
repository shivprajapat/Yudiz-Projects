// @ts-check
const SubscriptionFreezeLogModel = require('./model')
const SubscriptionModel = require('../model')
const { status, jsonStatus, messages } = require('../../../helper/api.response')
const { catchError, pick, getPaginationValues } = require('../../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { operationName, operationCode } = require('../../../data')
const { addLog } = require('../../operationLog/service')

class SubscriptionFreezeLog {
  async freeze (req, res) {
    try {
      req.body = pick(req.body, ['nDay', 'iSubscriptionId'])
      const isSubscriptionExists = await SubscriptionModel.findOne({ _id: req.body.iSubscriptionId, eStatus: { $in: ['Y', 'F'] } }, { _id: 1 }).lean()
      if (!isSubscriptionExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
      const insertBody = { ...req.body, iCreatedBy: req.admin._id }
      await Promise.all([
        SubscriptionFreezeLogModel.create(insertBody),
        SubscriptionModel.updateOne({ _id: req.body.iSubscriptionId }, { $set: { eStatus: 'F' } })
      ])
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...insertBody }, sOperationName: operationName?.SUBSCRIPTION_FREEZE, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].freeze_success.replace('##', messages[req.userLanguage].subscription) })
    } catch (error) {
      catchError('Freeze', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const { iSubscriptionId, nDay } = req.body
      const isSubscriptionExists = await SubscriptionModel.findOne({ _id: iSubscriptionId, eStatus: { $in: ['Y', 'F'] } }, { _id: 1 }).lean()
      if (!isSubscriptionExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
      const updateResponse = await SubscriptionFreezeLogModel.updateOne({ _id: iSubscriptionId }, { $set: { nDay } })
      if (updateResponse?.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body }, sOperationName: operationName?.SUBSCRIPTION_FREEZE_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].freeze_success.replace('##', messages[req.userLanguage].subscription) })
      }
    } catch (error) {
      catchError('Freeze', error, req, res)
    }
  }

  async unFreeze (req, res) {
    try {
      req.body = pick(req.body, ['nDay', 'iSubscriptionId', 'endDate'])
      const isSubscriptionExists = await SubscriptionModel.findOne({ _id: req.body.iSubscriptionId, eStatus: { $in: ['F'] } }, { _id: 1, dEndDate: 1 }).lean()
      if (!isSubscriptionExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
      if (new Date(isSubscriptionExists?.dEndDate).getTime() > new Date(req.body?.endDate).getTime()) return res.status(status.UnprocessableEntity).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].subscription_end_range_error })
      await SubscriptionModel.updateOne({ _id: req.body.iSubscriptionId }, { $set: { eStatus: 'Y', dEndDate: req.body.dEndDate } })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body }, sOperationName: operationName?.SUBSCRIPTION_UNFREEZE, sOperationType: operationCode?.UPDATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].unfreeze_success.replace('##', messages[req.userLanguage].subscription) })
    } catch (error) {
      catchError('UnFreeze', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { iSubscriptionId } = req?.query
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)
      const queryStage = {}
      if (iSubscriptionId)queryStage.iSubscriptionId = new mongoose.Types.ObjectId(iSubscriptionId)
      const subscriptionFreezeLog = await SubscriptionFreezeLogModel.aggregate([
        {
          $facet: {
            aFreezedLogList: [
              { $match: queryStage },
              { $sort: sorting },
              { $skip: page },
              { $limit: limit }
            ],
            total: [
              { $match: queryStage },
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aFreezedLog: subscriptionFreezeLog[0].aFreezedLogList, count: subscriptionFreezeLog[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].subscription), data })
    } catch (error) {
      catchError('Freeze', error, req, res)
    }
  }
}

module.exports = new SubscriptionFreezeLog()
