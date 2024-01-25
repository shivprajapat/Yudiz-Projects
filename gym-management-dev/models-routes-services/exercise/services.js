// @ts-check
const ExerciseModel = require('./model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, pick, getPaginationValues } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const { addLog } = require('../operationLog/service')

class Subscription {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sDescription', 'eStatus'])
      await ExerciseModel.create(req.body)
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body }, sOperationName: operationName?.EXERCISE_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].exercise) })
    } catch (error) {
      catchError('Exercise.add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const exercise = await ExerciseModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { __v: 0 }).lean()
      if (!exercise) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].exercise) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].exercise), exercise })
    } catch (error) {
      catchError('Exercise.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      req.body = pick(req.body, ['sName', 'sDescription', 'eStatus'])
      const exercise = await ExerciseModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { ...req.body }, { runValidators: true })
      if (exercise.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...req.body, _id: req.params.id }, sOperationName: operationName?.EXERCISE_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].exercise) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].exercise) })
    } catch (error) {
      catchError('Exercise.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const exercise = await ExerciseModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (exercise.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id }, sOperationName: operationName?.EXERCISE_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].exercise) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].exercise) })
    } catch (error) {
      catchError('Exercise.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const firstStage = {
        eStatus: { $ne: 'D' }
      }
      if (search.length)firstStage.sName = { $regex: search, $options: 'i' }
      const queryStage = [
        {
          $match: firstStage
        }
      ]
      const projectStage = { __v: 0 }
      const response = await ExerciseModel.aggregate([
        {
          $facet: {
            aExercise: [
              ...queryStage,
              { $sort: sorting },
              { $skip: page },
              { $limit: limit },
              { $project: projectStage }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aExerciseList: response[0].aExercise, count: response[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].exercise), data })
    } catch (error) {
      catchError('Exercise.list', error, req, res)
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
//     const subScriptionList = await ExerciseModel.find(queryStage, { _id: 1 }).lean()
//     const willExpireSubScriptionIds = subScriptionList?.map(({ _id }) => _id)
//     if (willExpireSubScriptionIds?.length) await ExerciseModel.updateMany({ _id: { $in: willExpireSubScriptionIds } }, { $set: { eStatus: 'E' } })
//   } catch (error) {
//     catchError('Exercise.list', error)
//   }
// }
module.exports = new Subscription()
