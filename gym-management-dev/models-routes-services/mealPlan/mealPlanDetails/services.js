// @ts-check
const MealPlanDetailModel = require('./model')
const MealPlanModel = require('../model')
const { status, jsonStatus, messages } = require('../../../helper/api.response')
const { catchError, getPaginationValues } = require('../../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../../operationLog/service')
const { operationName, operationCode } = require('../../../data')

class MealPlanDetails {
  async add(req, res) {
    try {
      const { iMealPlanId } = req?.body
      const isMealPlanExists = await MealPlanModel.findOne({ _id: iMealPlanId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isMealPlanExists) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].mealPlan)
        })
      }
      const dateList = req.body?.aPlanDetails?.map(({ dMealPlanDate }) => dMealPlanDate)
      const isMealPlanDetailsExists = await MealPlanDetailModel.findOne({ iMealPlanId, dMealPlanDate: { $in: dateList } })
      if (isMealPlanDetailsExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mealPlanDetail)
        })
      }
      const insertBody = req.body?.aPlanDetails?.map((mealPlan) => {
        return { ...mealPlan, iMealPlanId }
      })
      await MealPlanDetailModel.insertMany(insertBody)
      await addLog({
        iOperationBy: req?.admin?._id,
        oOperationBody: req?.body,
        sOperationName: operationName.MEAL_PLAN_DETAIL_ADD,
        sOperationType: operationCode.CREATE
      })
      return res.status(status.Create).json({
        status: jsonStatus.Create,
        message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].mealPlanDetail)
      })
    } catch (error) {
      catchError('MealPlanDetails.Add', error, req, res)
    }
  }

  async update(req, res) {
    try {
      const { iMealPlanId, aPlanDetails } = req?.body
      const isMealPlanExists = await MealPlanModel.findOne({ _id: iMealPlanId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isMealPlanExists) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].mealPlan)
        })
      }
      await Promise.all(aPlanDetails.map(({ id, dMealPlanDate, sDescription }) => {
        return MealPlanDetailModel.updateOne({ _id: id }, { iMealPlanId, dMealPlanDate, sDescription })
      }))
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: req?.body, sOperationName: operationName.MEAL_PLAN_DETAIL_UPDATE, sOperationType: operationCode.UPDATE })
      return res.status(status.OK).json({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].mealPlanDetail)
      })
    } catch (error) {
      catchError('MealPlanDetails.Update', error, req, res)
    }
  }

  async get(req, res) {
    try {
      const { iMealPlanId, dFromDate, dToDate } = req?.query
      const { sorting } = getPaginationValues(req?.query)
      const query = { iMealPlanId: new mongoose.Types.ObjectId(iMealPlanId), dMealPlanDate: { $gte: new Date(dFromDate), $lte: new Date(dToDate) } }
      const projectStage = { iMealPlanId: 1, dMealPlanDate: 1, sDescription: 1, 'oMealPlan.sTitle': 1, 'oMealPlan.sDescription': 1 }
      const queryStage = [
        {
          $match: query
        },
        // {
        //   $lookup: {
        //     from: 'mealplans',
        //     localField: 'iMealPlanId',
        //     foreignField: '_id',
        //     as: 'oMealPlan'
        //   }
        // },
        // {
        //   $unwind: {
        //     path: '$oMealPlan',
        //     preserveNullAndEmptyArrays: true
        //   }
        // },
        { $sort: sorting },
        {
          $project: projectStage
        }
      ]
      const aMealPlan = await MealPlanDetailModel.aggregate(queryStage)
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), data: { aMealPlan } })
    } catch (error) {
      catchError('MealPlanDetails.Get', error, req, res)
    }
  }
}
module.exports = new MealPlanDetails()
