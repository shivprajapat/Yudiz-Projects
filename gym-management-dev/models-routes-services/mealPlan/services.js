// @ts-check
const MealPlanModel = require('./model')
const MealPlanDetailsModel = require('../mealPlan/mealPlanDetails/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, getPaginationValues } = require('../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../operationLog/service')
const { operationName, operationCode } = require('../../data')
const { gymDBConnect } = require('../../database/mongoose')

class MealPlan {
  async add (req, res) {
    try {
      const { sTitle, sDescription, eType, dStartDate, dEndDate } = req?.body
      let insertResponse
      if (eType === 'A') {
        insertResponse = await MealPlanModel.create({ sTitle, sDescription, eType, dStartDate, dEndDate })
      } else {
        insertResponse = await MealPlanModel.create(req.body)
      }
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: req?.body, sOperationName: operationName.MEAL_PLAN_ADD, sOperationType: operationCode.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].mealPlan), data: { iMealPlanId: insertResponse?._id } })
    } catch (error) {
      catchError('MealPlan.Add', error, req, res)
    }
  }

  async delete (req, res) {
    const session = await gymDBConnect?.startSession()
    try {
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
      }
      session.startTransaction(transactionOptions)
      const { id } = req?.params
      const deleteResponse = await MealPlanModel.updateOne({ _id: id }, { eStatus: 'D' }, { session })
      await MealPlanDetailsModel.updateMany({ iMealPlanId: id }, { eStatus: 'D' }, { session })
      if (!deleteResponse?.modifiedCount) {
        await session.abortTransaction()
        return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].mealPlan) })
      }
      await session.commitTransaction()
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: id, sOperationName: operationName.MEAL_PLAN_DELETE, sOperationType: operationCode.DELETE })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].mealPlan) })
    } catch (error) {
      await session.abortTransaction()
      catchError('MealPlan.Delete', error, req, res)
    } finally {
      await session.endSession()
    }
  }

  async get (req, res) {
    try {
      const queryStage = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req?.params?.id),
            eStatus: { $ne: 'D' }
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
          $project: { iCustomerId: 1, sTitle: 1, sDescription: 1, dStartDate: 1, dEndDate: 1, 'oCustomer.sName': 1 }
        }
      ]
      const response = await MealPlanModel.aggregate(queryStage)
      if (!response.length) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].mealPlan) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), oMealPlan: response?.[0] })
    } catch (error) {
      catchError('MealPlan.Get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const updateResponse = await MealPlanModel.updateOne({ _id: req?.params?.id }, req?.body)
      if (!updateResponse?.modifiedCount) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].mealPlan) })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: req?.body, sOperationName: operationName.MEAL_PLAN_UPDATE, sOperationType: operationCode.UPDATE })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].mealPlan) })
    } catch (error) {
      catchError('MealPlan.Update', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { iCustomerId, eType } = req?.query
      const { sorting, limit, page } = getPaginationValues(req?.query)
      const firstStage = {
        eStatus: { $ne: 'D' }
      }
      if (iCustomerId) firstStage.iCustomerId = new mongoose.Types.ObjectId(iCustomerId)
      if (eType) firstStage.eType = eType
      const projectStage = { iCustomerId: 1, sTitle: 1, sDescription: 1, dStartDate: 1, dEndDate: 1, 'oCustomer.sName': 1 }
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
        }
      ]
      const mealPlan = await MealPlanModel.aggregate([
        {
          $facet: {
            aMealPlan: [
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
      const data = { aPlanList: mealPlan[0].aMealPlan, count: mealPlan[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), data })
    } catch (error) {
      catchError('MealPlan.List', error, req, res)
    }
  }
}
module.exports = new MealPlan()
