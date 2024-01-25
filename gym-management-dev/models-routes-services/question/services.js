// @ts-check
const QuestionModel = require('./model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, getPaginationValues } = require('../../helper/utilities.services')
const { operationName, operationCode } = require('../../data')
const { addLog } = require('../operationLog/service')

class Question {
  async add (req, res) {
    try {
      await QuestionModel.create(req.body)
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body }, sOperationName: operationName?.QUESTION_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].question) })
    } catch (error) {
      catchError('Question.Add', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const question = await QuestionModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!question) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].question) })
      const updateResponse = await QuestionModel.updateOne({ _id: req.params.id }, { ...req.body }, { runValidators: true })
      if (updateResponse?.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.body, ...req.params }, sOperationName: operationName?.QUESTION_UPDATE, sOperationType: operationCode?.UPDATE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].question) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].question) })
    } catch (error) {
      catchError('Question.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const question = await QuestionModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!question) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].question) })
      const updateResponse = await QuestionModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (updateResponse.modifiedCount) {
        await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, iCreatedBy: req.admin?._id, ...req.params }, sOperationName: operationName?.QUESTION_DELETE, sOperationType: operationCode?.DELETE })
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].question) })
      }
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].question) })
    } catch (error) {
      catchError('Question.delete', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const oQuestion = await QuestionModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { __v: 0 }).lean()
      if (!oQuestion) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].question) })

      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].data), oQuestion })
    } catch (error) {
      catchError('Question.get', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const { eCategory } = req?.query
      const firstStage = { eStatus: { $ne: 'D' } }
      if (eCategory) {
        firstStage.eCategory = eCategory
      }
      if (req?.query?.isBranch)firstStage.isBranch = req?.query.isBranch
      if (search.length)firstStage.sQuestion = { $regex: new RegExp(`^.*${search}.*`, 'i') }
      const [aQuestionList, count] = await Promise.all([
        QuestionModel.find(firstStage).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(),
        QuestionModel.countDocuments(firstStage)
      ])
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].question), data: { aQuestionList, count } })
    } catch (error) {
      catchError('Question.list', error, req, res)
    }
  }
}
module.exports = new Question()
