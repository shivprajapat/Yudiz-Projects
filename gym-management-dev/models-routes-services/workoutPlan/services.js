// @ts-check
const WorkoutPlanModel = require('./model')
const WorkoutPlanDetailsModel = require('./workoutPlanDetails/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, getPaginationValues } = require('../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../operationLog/service')
const { operationName, operationCode } = require('../../data')
const { gymDBConnect } = require('../../database/mongoose')

class WorkoutPlan {
  async add(req, res) {
    try {
      const { eType, dStartDate, dEndDate, iCustomerId, sDescription, sTitle } = req?.body
      if (eType === 'A') {
        await WorkoutPlanModel.insertMany({ eType, dStartDate, dEndDate, iCustomerId, sDescription, sTitle })
      } else {
        await WorkoutPlanModel.insertMany(req.body)
      }
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: req?.body, sOperationName: operationName.WORKOUT_PLAN_ADD, sOperationType: operationCode.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].workoutPlan) })
    } catch (error) {
      catchError('WorkoutPlan.Add', error, req, res)
    }
  }

  async update(req, res) {
    try {
      const id = req?.params?.id
      const updateResponse = await WorkoutPlanModel.updateOne({ _id: id }, req?.body)
      if (!updateResponse?.modifiedCount) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].workoutPlan) })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: req?.body, sOperationName: operationName.WORKOUT_PLAN_UPDATE, sOperationType: operationCode.UPDATE })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].workoutPlan) })
    } catch (error) {
      catchError('WorkoutPlan.Update', error, req, res)
    }
  }

  async get(req, res) {
    try {
      const { id } = req?.params
      const project = { dStartDate: 1, dEndDate: 1, iCustomerId: 1, sTitle: 1, sDescription: 1, eType: 1 }
      const queryStage = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            eStatus: { $ne: 'D' }
          }
        },
        {
          $project: project
        }
      ]
      const aWorkoutPlan = await WorkoutPlanModel.aggregate(queryStage)
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), oWorkoutPlan: aWorkoutPlan?.[0] })
    } catch (error) {
      catchError('WorkoutPlan.Get', error, req, res)
    }
  }

  async delete(req, res) {
    const session = await gymDBConnect?.startSession()
    try {
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
      }
      session.startTransaction(transactionOptions)
      const { id } = req?.params
      const deleteResponse = await WorkoutPlanModel.updateOne({ _id: id }, { eStatus: 'D' }, { session })
      await WorkoutPlanDetailsModel.updateMany({ iWorkoutPlanId: id }, { eStatus: 'D' }, { session })
      if (!deleteResponse?.modifiedCount) {
        await session.abortTransaction()
        return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].workoutPlan) })
      }
      await session.commitTransaction()
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: id, sOperationName: operationName.WORKOUT_PLAN_DELETE, sOperationType: operationCode.DELETE })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].workoutPlan) })
    } catch (error) {
      await session.abortTransaction()
      catchError('WorkoutPlan.Delete', error, req, res)
    } finally {
      await session.endSession()
    }
  }

  async list(req, res) {
    try {
      const { iCustomerId, eType } = req?.query
      const { sorting, limit, page } = getPaginationValues(req?.query)
      const firstStage = {}
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
      const workoutPlan = await WorkoutPlanModel.aggregate([
        {
          $facet: {
            aWorkoutPlan: [
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
      const data = { aPlanList: workoutPlan[0].aWorkoutPlan, count: workoutPlan[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), data })
    } catch (error) {
      catchError('WorkoutPlan.List', error, req, res)
    }
  }
}
module.exports = new WorkoutPlan()
