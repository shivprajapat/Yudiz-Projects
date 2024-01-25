// @ts-check
const SubscriptionModel = require('./model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, pick, getPaginationValues } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const CustomerModel = require('../customer/model')
const TransactionModel = require('../transaction/model')
const TrainerModel = require('../employee/model')
const OrganizationModel = require('../organization/model')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../operationLog/service')

class Subscription {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['iCustomerId', 'dStartDate', 'dEndDate', 'iTrainerId', 'nPrice', 'iBranchId', 'nPaymentCycle'])
      const [isBranchExists, isCustomerExist] = await Promise.all([
        OrganizationModel.findOne({ _id: req.body.iBranchId }, { _id: 1 }),
        CustomerModel.findOne({ _id: req.body.iCustomerId, eStatus: 'Y' }, { _id: 1 }).lean()
      ])
      if (!isBranchExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].organization) })
      if (!isCustomerExist) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].customer) })
      if (req.body?.iTrainerId) {
        const isTrainerExist = await TrainerModel.findOne({ _id: req.body.iTrainerId, eStatus: 'Y', eUserType: 'T' }, { _id: 1 }).lean()
        if (!isTrainerExist) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].trainer) })
      }
      if (new Date(req.body.dStartDate) > new Date(req.body.dEndDate)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_range_error })
      const insertBody = { ...req.body, iCreatedBy: req.admin._id }
      await SubscriptionModel.create(insertBody)
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...insertBody }, sOperationName: operationName?.SUBSCRIPTION_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].subscription) })
    } catch (error) {
      catchError('Subscription.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const projectStage = {
        iTrainerId: 1,
        ePaymentStatus: 1,
        nPaymentCycle: 1,
        iBranchId: 1,
        iCustomerId: 1,
        iCreatedBy: 1,
        eStatus: 1,
        nPrice: 1,
        dStartDate: 1,
        dEndDate: 1,
        'oCustomer._id': 1,
        'oCustomer.sName': 1,
        'oTrainer._id': 1,
        'oTrainer.sName': 1,
        nPaidAmount: {
          $ifNull: ['$oSubscription.nPaidAmount', 0]
        },
        'oBranch._id': 1,
        'oBranch.sName': 1
      }
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
            as: 'oBranch'
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
            from: 'customers',
            localField: 'iCustomerId',
            foreignField: '_id',
            as: 'oCustomer'
          }
        },
        {
          $unwind: {
            path: '$oCustomer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'transactions',
            localField: '_id',
            foreignField: 'iSubscriptionId',
            as: 'oSubscription',
            pipeline: [
              {
                $match: {
                  eStatus: { $ne: 'D' }
                }
              },
              {
                $group: {
                  _id: '$iSubscriptionId',
                  nPaidAmount: { $sum: '$nPrice' }
                }
              }
            ]
          }
        },
        {
          $unwind: {
            path: '$oSubscription',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'iTrainerId',
            foreignField: '_id',
            as: 'oTrainer'
          }
        },
        {
          $unwind: {
            path: '$oTrainer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: projectStage
        }
      ]
      const subscription = await SubscriptionModel.aggregate(queryStage)
      if (!subscription?.[0]) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].subscription), subscription: subscription?.[0] })
    } catch (error) {
      catchError('Subscription.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['iCustomerId', 'dStartDate', 'dEndDate', 'iTrainerId', 'nPrice', 'iBranchId', 'nPaymentCycle'])
      const [isBranchExists, isCustomerExist] = await Promise.all([
        OrganizationModel.findOne({ _id: req.body.iBranchId }, { _id: 1 }),
        CustomerModel.findOne({ _id: req.body?.iCustomerId, eStatus: 'Y' }, { _id: 1 }).lean()
      ])
      if (!isBranchExists) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch) })
      if (!isCustomerExist) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].customer) })
      if (req.body?.iTrainerId) {
        const isTrainerExist = await TrainerModel.findOne({ _id: req.body?.iTrainerId, eStatus: 'Y', eUserType: 'T' }, { _id: 1 }).lean()
        if (!isTrainerExist) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].trainer) })
      }
      if (new Date(req.body.dStartDate) > new Date(req.body.dEndDate)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].date_range_error })
      const previousTransactionList = await TransactionModel.aggregate([
        {
          $match: {
            iSubscriptionId: new mongoose.Types.ObjectId(req.params.id),
            eStatus: { $ne: 'D' }
          }
        },
        {
          $group: {
            _id: {
              iSubscriptionId: new mongoose.Types.ObjectId(req.params.id)
            },
            totalAmount: {
              $sum: '$nPrice'
            }
          }
        }
      ])
      const totalPaidAmount = previousTransactionList?.[0]?.totalAmount ?? 0
      if (totalPaidAmount > req?.body?.nPrice) {
        return res.status(status.UnprocessableEntity).json({
          status: jsonStatus.UnprocessableEntity,
          message: messages[req.userLanguage].subscription_price_error
        })
      } else if (totalPaidAmount < req?.body?.nPrice) {
        req.body.ePaymentStatus = 'P'
      }
      const subscription = await SubscriptionModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { ...req.body }, { runValidators: true })
      if (subscription.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body, _id: req.params.id }, sOperationName: operationName?.SUBSCRIPTION_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].subscription) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
    } catch (error) {
      catchError('Subscription.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const subscription = await SubscriptionModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (subscription.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id }, sOperationName: operationName?.SUBSCRIPTION_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].subscription) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
    } catch (error) {
      catchError('Subscription.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { nExpireInDay, iBranchId, eStatus, iCustomerId, iTrainerId } = req.query
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const expirationDate = new Date(new Date(new Date().setDate(new Date().getDate() + parseInt(nExpireInDay))).setHours(0, 0, 0, 0))
      const firstStage = {
        eStatus: { $ne: 'D' }
      }
      if (nExpireInDay) {
        firstStage.dEndDate = { $lte: expirationDate }
        firstStage.eStatus = { $nin: ['F', 'D', 'E'] }
      }
      if (iTrainerId)firstStage.iTrainerId = new mongoose.Types.ObjectId(iTrainerId)
      if (iCustomerId)firstStage.iCustomerId = new mongoose.Types.ObjectId(iCustomerId)
      if (iBranchId)firstStage.iBranchId = new mongoose.Types.ObjectId(iBranchId)
      if (eStatus)firstStage.eStatus = eStatus

      const searchStage = search?.length
        ? {
            $or: [
              {
                'oCustomer.sName': { $regex: search, $options: 'i' }
              },
              {
                'oCustomer.sMobile': { $regex: search, $options: 'i' }
              },
              {
                'oTrainer.sName': { $regex: search, $options: 'i' }
              }
            ]
          }
        : {}
      const queryStage = [
        {
          $match: firstStage
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'iCustomerId',
            foreignField: '_id',
            as: 'oCustomer'
          }
        },
        {
          $unwind: {
            path: '$oCustomer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'transactions',
            localField: '_id',
            foreignField: 'iSubscriptionId',
            as: 'oSubscription',
            pipeline: [
              {
                $match: {
                  eStatus: { $ne: 'D' }
                }
              },
              {
                $group: {
                  _id: '$iSubscriptionId',
                  nPaidAmount: { $sum: '$nPrice' }
                }
              }
            ]
          }
        },
        {
          $unwind: {
            path: '$oSubscription',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: searchStage
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'iTrainerId',
            foreignField: '_id',
            as: 'oTrainer'
          }
        },
        {
          $unwind: {
            path: '$oTrainer',
            preserveNullAndEmptyArrays: true
          }
        }
      ]
      const projectStage = {
        iTrainerId: 1,
        ePaymentStatus: 1,
        nPaymentCycle: 1,
        iBranchId: 1,
        iCustomerId: 1,
        iCreatedBy: 1,
        eStatus: 1,
        nPrice: 1,
        dStartDate: 1,
        dEndDate: 1,
        'oCustomer._id': 1,
        'oCustomer.sName': 1,
        'oTrainer._id': 1,
        'oTrainer.sName': 1,
        nPaidAmount: {
          $ifNull: ['$oSubscription.nPaidAmount', 0]
        }
      }
      const subscribedUsers = await SubscriptionModel.aggregate([
        {
          $facet: {
            aSubscribedUsers: [
              ...queryStage,
              {
                $project: projectStage
              },
              { $sort: sorting },
              { $skip: page },
              { $limit: limit }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aSubscriptionList: subscribedUsers[0].aSubscribedUsers, count: subscribedUsers[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].subscription), data })
    } catch (error) {
      catchError('Subscription.list', error, req, res)
    }
  }
}
// const checkAndExpireSubscription = async () => {
//   try {
//     const expirationDate = new Date(new Date().setHours(0, 0, 0, 0))
//     const queryStage = {
//       dEndDate: {
//         $lte: expirationDate
//       },
//       eStatus: { $nin: ['F', 'D', 'E'] }
//     }
//     const subScriptionList = await SubscriptionModel.find(queryStage, { _id: 1 }).lean()
//     const willExpireSubScriptionIds = subScriptionList?.map(({ _id }) => _id)
//     if (willExpireSubScriptionIds?.length) await SubscriptionModel.updateMany({ _id: { $in: willExpireSubScriptionIds } }, { $set: { eStatus: 'E' } })
//   } catch (error) {
//     catchError('Subscription.list', error)
//   }
// }
module.exports = new Subscription()
