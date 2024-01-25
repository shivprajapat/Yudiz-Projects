// @ts-check
const BatchScheduleModel = require('./model')
const BranchModel = require('../organization/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, getPaginationValues } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const { addLog } = require('../operationLog/service')
const { default: mongoose } = require('mongoose')

class BatchSchedule {
  async add (req, res) {
    try {
      if (req?.body?.iBranchId) {
        const isBranchExists = await BranchModel.findOne({ _id: req?.body?.iBranchId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
        if (!isBranchExists) {
          return res.status(status.NotFound).json({
            status: jsonStatus.NotFound,
            message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch)
          })
        }
      }
      await BatchScheduleModel.create(req.body)
      await addLog({
        iOperationBy: req?.admin?._id,
        oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body },
        sOperationName: operationName?.BATCH_SCHEDULE_ADD,
        sOperationType: operationCode?.CREATE
      })
      return res.status(status.Create).json({
        status: jsonStatus.Create,
        message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].batchSchedule)
      })
    } catch (error) {
      catchError('Batch.Add', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const isBatchExists = await BatchScheduleModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!isBatchExists) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      if (req?.body?.iBranchId) {
        const isBranchExists = await BranchModel.findOne({ _id: req?.body?.iBranchId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
        if (!isBranchExists) {
          return res.status(status.NotFound).json({
            status: jsonStatus.NotFound,
            message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
          })
        }
      }
      const updateResponse = await BatchScheduleModel.updateOne({ _id: req.params.id }, { ...req.body }, { runValidators: true })
      if (updateResponse?.modifiedCount) {
        await addLog({
          iOperationBy: req?.admin?._id,
          oOperationBody: {
            ip: req?.userIP,
            iCreatedBy: req.admin?._id,
            ...req.body,
            ...req.params
          },
          sOperationName: operationName?.QUESTION_UPDATE,
          sOperationType: operationCode?.UPDATE
        })
        return res.status(status.OK).json({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      return res.status(status.NotFound).json({
        status: jsonStatus.NotFound,
        message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
      })
    } catch (error) {
      catchError('Batch.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const isBatchExists = await BatchScheduleModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!isBatchExists) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      const updateResponse = await BatchScheduleModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (updateResponse.modifiedCount) {
        await addLog({
          iOperationBy: req?.admin?._id,
          oOperationBody: {
            ip: req?.userIP,
            iCreatedBy: req.admin?._id,
            ...req.params
          },
          sOperationName: operationName?.QUESTION_DELETE,
          sOperationType: operationCode?.DELETE
        })
        return res.status(status.OK).json({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      return res.status(status.NotFound).json({
        status: jsonStatus.NotFound,
        message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
      })
    } catch (error) {
      catchError('Batch.delete', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const queryStage = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id)
          }
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
          $project: { 'oBranch.sName': 1, 'oBranch._id': 1, sTitle: 1, sDescription: 1, sStartTime: 1, sEndTime: 1, eStatus: 1 }
        }
      ]
      const oBatchSchedule = await BatchScheduleModel.aggregate(queryStage)
      if (!oBatchSchedule?.[0]) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].batchSchedule),
        data: oBatchSchedule?.[0]
      })
    } catch (error) {
      catchError('Batch.get', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const firstStage = { eStatus: { $ne: 'D' } }
      if (search.length)firstStage.sTitle = { $regex: new RegExp(`^.*${search}.*`, 'i') }
      if (req?.query?.iBranchId)firstStage.iBranchId = new mongoose.Types.ObjectId(req?.query?.iBranchId)
      const projectStage = { 'oBranch.sName': 1, 'oBranch._id': 1, sTitle: 1, sDescription: 1, sStartTime: 1, sEndTime: 1, eStatus: 1 }
      const aBatchSchedule = await BatchScheduleModel.aggregate([{
        $facet: {
          aBatch: [
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
      }])
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].batchSchedule),
        data: { aBatchSchedule: aBatchSchedule?.[0]?.aBatch, count: aBatchSchedule?.[0]?.total?.[0]?.total ?? 0 }
      })
    } catch (error) {
      catchError('Batch.list', error, req, res)
    }
  }
}
module.exports = new BatchSchedule()
