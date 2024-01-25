// @ts-check
const WorkoutPlanDetailsModel = require('./model')
const WorkoutPlanModel = require('../model')
const { status, jsonStatus, messages } = require('../../../helper/api.response')
const { catchError, getPaginationValues } = require('../../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../../operationLog/service')
const { operationName, operationCode } = require('../../../data')

class WorkoutPlanDetails {
  async add(req, res) {
    try {
      const { iWorkoutPlanId } = req?.body
      const isWorkoutPlanExists = await WorkoutPlanModel.findOne({ _id: iWorkoutPlanId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isWorkoutPlanExists) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].workoutPlan)
        })
      }
      const dateList = req.body?.aPlanDetails?.map(({ dWorkoutPlanDate }) => dWorkoutPlanDate)
      const isWorkoutPlanDetailsExists = await WorkoutPlanDetailsModel.findOne({ iWorkoutPlanId, dWorkoutPlanDate: { $in: dateList } })
      if (isWorkoutPlanDetailsExists) {
        return res.status(status.BadRequest).json({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].workoutPlanDetails)
        })
      }
      const insertBody = req.body?.aPlanDetails?.map((workoutPlan) => {
        return { ...workoutPlan, iWorkoutPlanId }
      })
      await WorkoutPlanDetailsModel.insertMany(insertBody)
      await addLog({
        iOperationBy: req?.admin?._id,
        oOperationBody: req?.body,
        sOperationName: operationName.WORKOUT_PLAN_DETAIL_ADD,
        sOperationType: operationCode.CREATE
      })
      return res.status(status.Create).json({
        status: jsonStatus.Create,
        message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workoutPlanDetails)
      })
    } catch (error) {
      catchError('WorkoutPlanDetails.Add', error, req, res)
    }
  }

  async update(req, res) {
    try {
      const { iWorkoutPlanId, aPlanDetails } = req?.body
      const isWorkoutPlanExists = await WorkoutPlanModel.findOne({ _id: iWorkoutPlanId, eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
      if (!isWorkoutPlanExists) {
        return res.status(status.NotFound).json({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].workoutPlan)
        })
      }
      await Promise.all(aPlanDetails.map(({ id, dWorkoutPlanDate, sDescription }) => {
        return WorkoutPlanDetailsModel.updateOne({ _id: id }, { iWorkoutPlanId, dWorkoutPlanDate, sDescription })
      }))
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: req?.body, sOperationName: operationName.WORKOUT_PLAN_DETAIL_UPDATE, sOperationType: operationCode.UPDATE })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].workoutPlanDetails) })
    } catch (error) {
      catchError('WorkoutPlanDetails.Update', error, req, res)
    }
  }

  async get(req, res) {
    try {
      const { iWorkoutPlanId, dFromDate, dToDate } = req?.query
      const { sorting } = getPaginationValues(req?.query)
      const query = { iWorkoutPlanId: new mongoose.Types.ObjectId(iWorkoutPlanId), dWorkoutDate: { $gte: new Date(dFromDate), $lte: new Date(dToDate) } }
      const projectStage = { iWorkoutPlanId: 1, iExerciseId: 1, dWorkoutDate: 1, sDescription: 1, 'oWorkoutPlan.sTitle': 1, 'oWorkoutPlan.sDescription': 1, 'oExercise.sName': 1, 'oExercise.sDescription': 1 }
      const queryStage = [
        {
          $match: query
        },
        // {
        //   $lookup: {
        //     from: 'workoutplans',
        //     localField: 'iWorkoutPlanId',
        //     foreignField: '_id',
        //     as: 'oWorkoutPlan'
        //   }
        // },
        // {
        //   $unwind: {
        //     path: '$oWorkoutPlan',
        //     preserveNullAndEmptyArrays: true
        //   }
        // },
        {
          $lookup: {
            from: 'exercises',
            localField: 'iExerciseId',
            foreignField: '_id',
            as: 'oExercise'
          }
        },
        {
          $unwind: {
            path: '$oExercise',
            preserveNullAndEmptyArrays: true
          }
        },
        { $sort: sorting },
        {
          $project: projectStage
        }
      ]
      const aWorkoutPlanDetails = await WorkoutPlanDetailsModel.aggregate(queryStage)
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), data: { aWorkoutPlanDetails } })
    } catch (error) {
      catchError('WorkoutPlanDetails.Get', error, req, res)
    }
  }
}
module.exports = new WorkoutPlanDetails()
