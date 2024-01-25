// @ts-check
const CustomerModel = require('./model')
const OrganizationModel = require('../organization/model')
const BatchScheduleModel = require('../batchSchedule/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { pick, catchError, getPaginationValues } = require('../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../operationLog/service')
const { operationName, operationCode } = require('../../data')

class Customer {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sEmail', 'sMobile', 'nAge', 'eGender', 'sAddress', 'dBirthDate', 'dAnniversaryDate', 'iBranchId', 'oReferInfo', 'sFitnessGoal', 'iBatchScheduleId'])
      const [isCustomerExist, isBranchExists, isBatchScheduleExists] = await Promise.all([
        CustomerModel.findOne({
          $or: [{ sMobile: req.body.sMobile }, { sEmail: req.body.sEmail }],
          eStatus: { $ne: 'D' }
        }, { sMobile: 1, sEmail: 1, _id: 0 }).lean(),
        OrganizationModel.findOne({ _id: req.body.iBranchId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean(),
        BatchScheduleModel.findOne({ _id: req?.body?.iBatchScheduleId, eStatus: { $ne: 'D' } }).lean()
      ])
      if (isCustomerExist) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].customer)
        })
      }
      if (!isBranchExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch)
        })
      }
      if (!isBatchScheduleExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      const insertBody = { ...req.body, iCreateBy: req?.admin?._id }
      await CustomerModel.create(insertBody)
      await addLog({
        iOperationBy: req?.admin?._id,
        oOperationBody: { ip: req?.userIP, ...insertBody },
        sOperationName: operationName?.CUSTOMER_ADD,
        sOperationType: operationCode?.CREATE
      })
      return res.status(status.Create).json({
        status: jsonStatus.Create,
        message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].customer)
      })
    } catch (error) {
      catchError('Customer.Add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const queryStage = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.id),
            eStatus: { $ne: 'D' }
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
          $lookup: {
            from: 'batchschedules',
            localField: 'iBatchScheduleId',
            foreignField: '_id',
            as: 'oBatchSchedule',
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
            path: '$oBatchSchedule',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            oReferInfo: 1,
            sName: 1,
            sEmail: 1,
            sMobile: 1,
            nAge: 1,
            eGender: 1,
            sAddress: 1,
            eStatus: 1,
            sFitnessGoal: 1,
            iBatchScheduleId: 1,
            dBirthDate: 1,
            dAnniversaryDate: 1,
            'oBranch.sName': 1,
            'oBranch._id': 1,
            'oBatchSchedule.sTitle': 1,
            'oBatchSchedule._id': 1,
            'oBatchSchedule.sDescription': 1,
            'oBatchSchedule.sStartTime': 1,
            'oBatchSchedule.sEndTime': 1
          }
        }
      ]
      const customer = await CustomerModel.aggregate(queryStage)
      if (!customer?.[0]) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].customer)
        })
      }
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].customer),
        data: customer?.[0]
      })
    } catch (error) {
      catchError('Customer.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sEmail', 'sMobile', 'nAge', 'eGender', 'sAddress', 'dBirthDate', 'dAnniversaryDate', 'iBranchId', 'sFitnessGoal', 'iBatchScheduleId'])
      const [customer, isBranchExists, isBatchScheduleExists] = await Promise.all([
        CustomerModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean(),
        OrganizationModel.findOne({ _id: req.body.iBranchId }, { _id: 1 }).lean(),
        BatchScheduleModel.findOne({ _id: req?.body?.iBatchScheduleId, eStatus: { $ne: 'D' } }).lean()
      ])
      if (!customer) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].customer)
        })
      }
      if (!isBatchScheduleExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].batchSchedule)
        })
      }
      if (!isBranchExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch)
        })
      }
      if (req.body.sEmail || req.body.sMobile) {
        const query = []
        if (req.body.sEmail) query.push({ sEmail: req.body.sEmail })
        if (req.body.sMobile) query.push({ sMobile: req.body.sMobile })

        const isCustomerExist = await CustomerModel.find({ _id: { $ne: req.params.id }, eStatus: { $ne: 'D' }, $or: query }, { sEmail: 1, sMobile: 1 }).lean()

        if (isCustomerExist.find(e => e.sEmail === req.body.sEmail)) {
          return res.status(status.BadRequest).json({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email)
          })
        }
        if (isCustomerExist.find(e => e.sMobile === req.body.sMobile)) {
          return res.status(status.BadRequest).json({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobile)
          })
        }
      }

      const updateResponse = await CustomerModel.updateOne({ _id: req.params.id }, { ...req.body }, { runValidators: true })
      if (updateResponse.modifiedCount) {
        await addLog({
          iOperationBy: req?.admin?._id,
          oOperationBody: { ip: req?.userIP, ...req.body, _id: req.params.id },
          sOperationName: operationName?.CUSTOMER_UPDATE,
          sOperationType: operationCode?.UPDATE
        })
        return res.status(status.OK).json({
          status: jsonStatus.OK,
          message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].customer)
        })
      }
      return res.status(status.NotFound).json({
        status: jsonStatus.NotFound,
        message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].customer)
      })
    } catch (error) {
      catchError('Customer.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const customer = await CustomerModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (customer.modifiedCount) {
        await addLog({
          iOperationBy: req?.admin?._id,
          oOperationBody: { ip: req?.userIP, _id: req.params.id },
          sOperationName: operationName?.CUSTOMER_DELETE,
          sOperationType: operationCode?.DELETE
        })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].customer) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].customer) })
    } catch (error) {
      catchError('Customer.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const currentDate = new Date()
      const firstStage = {
        eStatus: { $eq: 'Y' }
      }
      if (req.query.eGender)firstStage.eGender = req.query.eGender
      if (req.query.iBranchId) firstStage.iBranchId = new mongoose.Types.ObjectId(req.query.iBranchId)
      if (search?.length) {
        firstStage.$or = [
          { sName: { $regex: new RegExp(`^.*${search}.*`, 'i') } },
          { sEmail: { $regex: new RegExp(`^.*${search}.*`, 'i') } },
          { sMobile: { $regex: new RegExp(`^.*${search}.*`, 'i') } }
        ]
      }
      if (req?.query?.iEventBeforeDay) {
        if (req?.query?.sEventType === 'B') {
          firstStage.birthdayRemindFrom = { $lte: currentDate }
          firstStage.birthdayRemindTo = { $gte: currentDate }
        } else if (req?.query?.sEventType === 'A') {
          firstStage.birthdayRemindFrom = { $lte: currentDate }
          firstStage.birthdayRemindTo = { $gte: currentDate }
        }
      }
      if (req.query?.iReferBy)firstStage['oReferInfo.iUserId'] = new mongoose.Types.ObjectId(req.query?.iReferBy)
      const projectFields = {
        oReferInfo: 1,
        iBranchId: 1,
        sName: 1,
        sEmail: 1,
        sMobile: 1,
        nAge: 1,
        eGender: 1,
        sAddress: 1,
        sFitnessGoal: 1,
        eStatus: 1,
        dCreatedDate: 1,
        dUpdatedDate: 1,
        dBirthDate: 1,
        dAnniversaryDate: 1,
        iBatchScheduleId: 1,
        'oBatchSchedule.sTitle': 1,
        'oBatchSchedule._id': 1,
        'oBranch._id': 1,
        'oBranch.sName': 1
      }

      const queryStage = [
        {
          $addFields: {
            birthdayRemindFrom: {
              $dateAdd: {
                startDate: {
                  $dateFromParts: {
                    year: currentDate.getFullYear(),
                    month: { $month: '$dBirthDate' },
                    day: { $dayOfMonth: '$dBirthDate' }
                  }
                },
                unit: 'day',
                amount: -parseInt(req?.query?.iEventBeforeDay ?? 0)
              }
            },
            birthdayRemindTo: {
              $dateAdd: {
                startDate: {
                  $dateFromParts: {
                    year: currentDate.getFullYear(),
                    month: { $month: '$dBirthDate' },
                    day: { $dayOfMonth: '$dBirthDate' }
                  }
                },
                unit: 'day',
                amount: 1
              }
            },
            anniversaryRemindFrom: {
              $dateAdd: {
                startDate: {
                  $dateFromParts: {
                    year: currentDate.getFullYear(),
                    month: { $month: '$dAnniversaryDate' },
                    day: { $dayOfMonth: '$dAnniversaryDate' }
                  }
                },
                unit: 'day',
                amount: -parseInt(req?.query?.iEventBeforeDay ?? 0)
              }
            },
            anniversaryRemindTo: {
              $dateAdd: {
                startDate: {
                  $dateFromParts: {
                    year: currentDate.getFullYear(),
                    month: { $month: '$dAnniversaryDate' },
                    day: { $dayOfMonth: '$dAnniversaryDate' }
                  }
                },
                unit: 'day',
                amount: 1
              }
            }
          }
        },
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
          $lookup: {
            from: 'batchschedules',
            localField: 'iBatchScheduleId',
            foreignField: '_id',
            as: 'oBatchSchedule',
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
            path: '$oBatchSchedule',
            preserveNullAndEmptyArrays: true
          }
        }
      ]
      const customerList = await CustomerModel.aggregate([
        {
          $facet: {
            aCustomerList: [
              ...queryStage,
              { $sort: sorting },
              { $skip: page },
              { $limit: limit },
              { $project: projectFields }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aCustomerList: customerList[0].aCustomerList, count: customerList[0].total[0]?.total || 0 }
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].customer),
        data
      })
    } catch (error) {
      catchError('Customer.list', error, req, res)
    }
  }
}
module.exports = new Customer()
