// @ts-check
const TransactionModel = require('./model')
const ReportModel = require('../report/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, pick, getPaginationValues } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const SubscriptionModel = require('../subscription/model')
const { addLog } = require('../operationLog/service')
const { default: mongoose } = require('mongoose')
const moment = require('moment')
const { createXlsxFile } = require('../../helper/common')
const { putObject, getObject } = require('../../helper/cloudStorage.services')
const config = require('../../config/config')

class Transaction {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['nPrice', 'iSubscriptionId', 'dTransactionDate', 'sDescription'])
      const subScriptionInfo = await SubscriptionModel.findOne({ _id: req.body.iSubscriptionId, eStatus: 'Y' }, { _id: 1, nPrice: 1, ePaymentStatus: 1 }).lean()
      if (!subScriptionInfo) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
      const previousTransactionList = await TransactionModel.aggregate([
        {
          $match: {
            iSubscriptionId: new mongoose.Types.ObjectId(req.body.iSubscriptionId),
            eStatus: { $ne: 'D' }
          }
        },
        {
          $group: {
            _id: {
              iSubscriptionId: new mongoose.Types.ObjectId(req.body.iSubscriptionId)
            },
            totalAmount: {
              $sum: '$nPrice'
            }
          }
        }
      ])
      const totalPaidAmount = previousTransactionList?.[0]?.totalAmount ?? 0
      const netTotal = req?.body?.nPrice + parseInt(totalPaidAmount)
      if (subScriptionInfo?.ePaymentStatus === 'C') return res.status(jsonStatus.UnprocessableEntity).json({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].transaction_already_completed })
      if (netTotal > subScriptionInfo?.nPrice) return res.status(jsonStatus.UnprocessableEntity).json({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].transaction_price_error })
      await TransactionModel.create(req.body)
      if (netTotal === subScriptionInfo?.nPrice) await SubscriptionModel.updateOne({ _id: req?.body?.iSubscriptionId }, { $set: { ePaymentStatus: 'C' } })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body }, sOperationName: operationName?.TRANSACTION_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].transaction) })
    } catch (error) {
      catchError('Transaction.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const queryStage = [
        {
          $match: {
            eStatus: { $ne: 'D' },
            _id: new mongoose.Types.ObjectId(req.params.id)
          }
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: 'iSubscriptionId',
            foreignField: '_id',
            as: 'oSubscription'
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
            from: 'customers',
            localField: 'oSubscription.iCustomerId',
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
          $project: {
            nPrice: 1,
            dTransactionDate: 1,
            iSubscriptionId: 1,
            sDescription: 1,
            eStatus: 1,
            dCreatedDate: 1,
            'oSubscription._id': 1,
            'oSubscription.iCustomerId': 1,
            'oSubscription.dStartDate': 1,
            'oSubscription.dEndDate': 1,
            'oSubscription.ePaymentStatus': 1,
            'oCustomer._id': 1,
            'oCustomer.sName': 1
          }
        }
      ]
      const transaction = await TransactionModel.aggregate(queryStage)
      if (!transaction) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].transaction) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].transaction), data: transaction?.[0] })
    } catch (error) {
      catchError('Transaction.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['nPrice', 'iSubscriptionId', 'dTransactionDate', 'sDescription'])
      if (req.body.iSubscriptionId) {
        const isSubscriptionExist = await SubscriptionModel.findOne({ _id: req.body.iSubscriptionId, eStatus: 'Y' }, { _id: 1 }).lean()
        if (!isSubscriptionExist) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].subscription) })
      }
      const transaction = await TransactionModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { ...req.body }, { runValidators: true })
      if (transaction.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body, _id: req.params.id }, sOperationName: operationName?.TRANSACTION_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].transaction) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].transaction) })
    } catch (error) {
      catchError('Transaction.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const transactionInfo = await TransactionModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { iSubscriptionId: 1 }).lean()
      if (!transactionInfo) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].transaction) })
      const [transactionDeleteResponse] = await Promise.all([
        TransactionModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true }),
        SubscriptionModel.updateOne({ _id: transactionInfo?.iSubscriptionId }, { ePaymentStatus: 'P' })
      ])
      if (transactionDeleteResponse.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id }, sOperationName: operationName?.TRANSACTION_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].transaction) })
      }
    } catch (error) {
      catchError('Transaction.delete', error, req, res)
    }
  }

  async upcomingTransaction (req, res) {
    try {
      const { iBeforeDay } = req?.query
      const { page = 0, limit = 10, sorting } = getPaginationValues(req.query)
      const queryStage = [
        {
          $match: {
            ePaymentStatus: { $ne: 'C' },
            eStatus: 'Y'
          }
        },
        {
          $lookup: {
            from: 'transactions',
            let: { localField: '$_id' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$$localField', '$iSubscriptionId'] } }
              },
              {
                $sort: { dTransactionDate: -1 }
              },
              {
                $limit: 1
              }
            ],
            as: 'oTransaction'
          }
        },
        {
          $unwind: {
            path: '$oTransaction',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            nextTransactionDate: {
              $dateAdd: {
                startDate: '$oTransaction.dTransactionDate',
                unit: 'month',
                amount: '$nPaymentCycle'
              }
            }
            // totalMonths: {
            //   $floor: {
            //     $divide: [
            //       { $subtract: ['$dEndDate', '$dStartDate'] },
            //       1000 * 60 * 60 * 24 * 30
            //     ]
            //   }
            // }
          }
        },
        {
          $addFields: {
            dRemindFromDate: {
              $dateAdd: {
                startDate: '$nextTransactionDate',
                unit: 'day',
                amount: -(iBeforeDay ?? 0)
              }
            }
          }
        },
        {
          $match: {
            dRemindFromDate: { $lte: new Date() }
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
            from: 'organizations',
            localField: 'iBranchId',
            foreignField: '_id',
            as: 'oOrganization',
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
            path: '$oOrganization',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            iSubscriptionId: '$_id',
            // nPrice: {
            //   $ceil: {
            //     $divide: ['$nPrice', '$totalMonths']
            //   }
            // },
            dNextTransactionDate: '$nextTransactionDate',
            sName: '$oCustomer.sName',
            sBranchName: '$oOrganization.sName'
          }
        }
      ]
      const response = await SubscriptionModel.aggregate([
        {
          $facet: {
            aTransactionList: [
              ...queryStage,
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
      const data = { transactions: response[0].aTransactionList, count: response[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: 'success', data })
    } catch (error) {
      catchError('Transaction.list', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { iSubscriptionId } = req.query
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const matchStage = { eStatus: { $ne: 'D' } }
      if (iSubscriptionId)matchStage.iSubscriptionId = new mongoose.Types.ObjectId(iSubscriptionId)

      const intermediateMatchStage = search?.length
        ? { 'oCustomer.sName': { $regex: search, $options: 'i' } }
        : {}

      const queryStage = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: 'iSubscriptionId',
            foreignField: '_id',
            as: 'oSubscription'
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
            from: 'customers',
            localField: 'oSubscription.iCustomerId',
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
          $project: {
            nPrice: 1,
            dTransactionDate: 1,
            sDescription: 1,
            'oSubscription._id': 1,
            'oSubscription.iCustomerId': 1,
            'oSubscription.dStartDate': 1,
            'oSubscription.dEndDate': 1,
            'oCustomer._id': 1,
            'oCustomer.sName': 1
          }
        },
        {
          $match: intermediateMatchStage
        }
      ]

      const transactions = await TransactionModel.aggregate([
        {
          $facet: {
            aTransactions: [
              ...queryStage,
              {
                $sort: sorting
              },
              {
                $skip: page
              },
              {
                $limit: limit
              }
            ],
            total: [
              ...queryStage,
              {
                $count: 'total'
              }
            ]
          }
        }
      ])

      const data = { transactions: transactions[0].aTransactions, count: transactions[0].total[0]?.total || 0 }

      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].transaction), data })
    } catch (error) {
      catchError('Transaction.list', error, req, res)
    }
  }

  async report (req, res) {
    try {
      const { dFrom, dTo, iCustomerId } = req?.body
      const matchStage = {}
      if (dFrom && dTo) {
        matchStage.dTransactionDate = {
          $gte: new Date(dFrom),
          $lte: new Date(new Date(dTo).setHours(23, 59, 59))
        }
      }
      const customerMatchStage = {}
      if (iCustomerId)customerMatchStage['oCustomer.iCustomerId'] = new mongoose.Types.ObjectId(iCustomerId)
      const queryStage = [
        {
          $match: matchStage
        }, {
          $lookup: {
            from: 'subscriptions',
            localField: 'iSubscriptionId',
            foreignField: '_id',
            as: 'oSubscription'
          }
        }, {
          $unwind: {
            path: '$oSubscription',
            preserveNullAndEmptyArrays: false
          }
        }, {
          $lookup: {
            from: 'customers',
            localField: 'oSubscription.iCustomerId',
            foreignField: '_id',
            as: 'oCustomer'
          }
        }, {
          $match: matchStage
        }, {
          $unwind: {
            path: '$oCustomer',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            nPaidAmount: '$nPrice',
            nTotalAmount: '$oSubscription.nPrice',
            sUserName: '$oCustomer.sName',
            sEmail: '$oCustomer.sEmail',
            sMobile: '$oCustomer.sMobile',
            sDescription: 1,
            dTransactionDate: 1,
            dCreatedDate: 1
          }
        }
      ]

      const transactionList = await TransactionModel.aggregate(queryStage)
      const schema = [
        {
          column: 'TransactionId',
          value: object => object._id,
          width: '15pt',
          align: 'center'
        },
        {
          column: 'Username',
          type: String,
          value: object => object.sUserName,
          width: '16.5pt',
          align: 'center'
        },
        {
          column: 'Mobile No.',
          type: String,
          width: '16.5pt',
          value: object => object.sMobile,
          align: 'center'
        },
        {
          column: 'Email',
          type: String,
          value: object => object.sEmail,
          width: '16.5pt',
          align: 'center'
        },
        {
          column: 'Paid Amount',
          type: Number,
          value: object => object.nPaidAmount,
          width: '16.5pt',
          align: 'center'
        }, {
          column: 'Transaction At',
          type: String,
          value: object => moment(object.dTransactionDate).format('lll'),
          align: 'center',
          width: '25pt'
        },
        {
          column: 'Description',
          type: String,
          value: object => object.sDescription,
          align: 'center',
          width: '25pt'
        }
      ]

      // GENERATE XLSX FILE
      const sFileName = 'Transaction_report'
      const file = await createXlsxFile(schema, transactionList, sFileName)
      // // PUSH OBJECT TO AWS CLOUD
      const sPath = config.S3_TRANSACTION_REPORT_PATH
      const sContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const sDeposition = `filename=${sFileName}.xlsx`
      const oPutResponse = await putObject({ sFileName: file.filename, sContentType, path: sPath, fileStream: file.content, sDeposition })
      const sObjectUrl = await getObject({ sFileName: oPutResponse?.fileName, path: sPath })
      await ReportModel.create({ sFileName: oPutResponse?.fileName, sPath, sType: 'T' })
      // ADD TO QUEUE FOR SEND EMAIL
      // queuePush(QUEUE_CONFIG?.EMAIL_QUEUE, {
      //   subject: 'Transaction Report',
      //   emailBody: 'Please find attached document for Transaction Report',
      //   to: req?.admin?.sEmail,
      //   attachments: [
      //     {
      //       filename: oPutResponse?.fileName,
      //       path: sObjectUrl
      //     }
      //   ]
      // })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].report_success, data: sObjectUrl })
    } catch (error) {
      catchError('Transaction.report', error, req, res)
    }
  }
}

module.exports = new Transaction()
