// @ts-check
const { operationCode, operationName } = require('../../../data')
const { status, jsonStatus, messages } = require('../../../helper/api.response')
const { catchError } = require('../../../helper/utilities.services')
const { addLog } = require('../../operationLog/service')
const LifeCycleHistoryModel = require('./model')

class LifeCycle {
  async add (req, res) {
    try {
      const response = await LifeCycleHistoryModel.updateOne({ customerId: req?.body?.customerId }, req.body, { upsert: true })
      if (response.upsertedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body }, sOperationName: operationName?.LIFECYCLE_HISTORY_ADD, sOperationType: operationCode?.CREATE })
        return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].lifecycleHistory) })
      } else {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body }, sOperationName: operationName?.LIFECYCLE_HISTORY_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].lifecycleHistory) })
      }
    } catch (error) {
      catchError('Lifecycle.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const { customerId } = req?.query
      const data = await LifeCycleHistoryModel.findOne({ customerId, eStatus: { $ne: 'D' } }, { __v: 0 }).lean()
      if (!data) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].lifecycleHistory) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].lifecycleHistory), data })
    } catch (error) {
      catchError('Lifecycle.get', error, req, res)
    }
  }
}

module.exports = new LifeCycle()
