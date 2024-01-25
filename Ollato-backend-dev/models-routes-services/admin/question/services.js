/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const QuestionModel = require('../../student/test/questions.model')
const QuestionAnswerModel = require('../../student/test/questions.ans.model')
const { Op } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const testDetailModel = require('../../student/test/test.detail.model')
const _ = require('lodash')

class QuestionService {
  async getQuestionById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await QuestionModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].question) })

      const questions = await QuestionModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        },
        include: [{
          model: QuestionAnswerModel,
          as: 'options'
        }, {
          model: testDetailModel,
          as: 'testDetails'
        }]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: questions, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('question.getAllQuestion', error, req, res)
    }
  }

  async getAllQuestion(req, res) {
    try {
      removenull(req.body)
      const { testDetailsId } = req.body
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const query = {
        [Op.or]: [
          {
            question: {
              [Op.like]: `%${search}%`
            }
          }
        ],
        deleted_at: null
      }
      if (testDetailsId) {
        query.test_detail_id = testDetailsId
      }

      const questions = await QuestionModel.findAll({
        where: query,
        include: [{
          model: QuestionAnswerModel,
          as: 'options'
        }, {
          model: testDetailModel,
          as: 'testDetails',
          attributes: ['title', 'test_id']
        }],
        order: sorting,
        limit,
        offset: start
      })
      const totalCount = await QuestionModel.count({
        where: query
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, count: totalCount, data: questions, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('question.getAllQuestion', error, req, res)
    }
  }

  async createQuestion(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line no-unused-vars
      const { question, marks, time_Sec, is_image, is_math, math_expression, sort_order, test_detail_id, options, path } = req.body

      const exist = await QuestionModel.findOne({ where: { question, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].question) })

      let transaction
      try {
        transaction = await sequelize.transaction()

        const sCustomId = randomStr(8, 'string')
        const questionCreated = await QuestionModel.create({ custom_id: sCustomId, test_detail_id, question, marks, time_Sec, is_image, path, is_math, math_expression, sort_order }, { transaction })

        const questionId = questionCreated.id

        const forLoop = async _ => {
          for (let i = 0; i < options.length; i++) {
            const sCustomIdOption = randomStr(8, 'string')
            await QuestionAnswerModel.create({ custom_id: sCustomIdOption, question_id: questionId, ans_desc: options[i].ans_desc, is_correct_ans: options[i].is_correct_ans, is_image: options[i].is_image, path: options[i].path, is_math: options[i].is_math, math_expression: options[i].math_expression, sort_order: options[i].sort_order }, { transaction })
          }
        }
        await forLoop()

        await transaction.commit()

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: questionCreated, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].question) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('question.createQuestion', error, req, res)
    }
  }

  async updateQuestion(req, res) {
    try {
      removenull(req.body)
      const { id, isActive, question, marks, time_Sec, is_image, is_math, math_expression, sort_order, test_detail_id, options, updateType, path } = req.body

      const quesId = parseInt(id)

      const exist = await QuestionModel.findOne({ where: { id: quesId, deleted_at: null } })
      if (!exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].question) })
      if (exist) {
        let statusTransaction
        try {
          statusTransaction = await sequelize.transaction()
          if (updateType && updateType === 'status') {
            await QuestionModel.update({ is_active: isActive }, { where: { id: quesId } }, { statusTransaction })
            await QuestionAnswerModel.update({ is_active: isActive }, { where: { question_id: quesId } }, { statusTransaction })
            await statusTransaction.commit()

            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].question) })
          } else {
            const titleExist = await QuestionModel.findAll({ raw: true, where: { id: { [Op.not]: quesId }, question, deleted_at: null } })
            if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].question) })
          }
        } catch (error) {
          if (statusTransaction) await statusTransaction.rollback()
          return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
        }
      }

      let transaction
      try {
        transaction = await sequelize.transaction()

        const sCustomId = randomStr(8, 'string')
        if (path !== null) {
          await QuestionModel.update({ custom_id: sCustomId, test_detail_id, question, marks, time_Sec, is_image, path, is_math, math_expression, sort_order }, { where: { id: quesId, deleted_at: null } }, { transaction })
        } else {
          await QuestionModel.update({ custom_id: sCustomId, test_detail_id, question, marks, time_Sec, is_image, path, is_math, math_expression, sort_order }, { where: { id: quesId, deleted_at: null } }, { transaction })
        }

        const getOptions = await QuestionAnswerModel.findAll({ where: { question_id: quesId } })

        const forLoop = async _ => {
          for (let i = 0; i < options.length; i++) {
            const sCustomIdOption = randomStr(8, 'string')

            // const isImg = parseBooleans(options[i].is_image)

            if (!options[i].id) {
              // create new option
              await QuestionAnswerModel.create({ custom_id: sCustomIdOption, question_id: quesId, ans_desc: options[i].ans_desc, is_correct_ans: options[i].is_correct_ans, is_image: options[i].is_image, path: options[i].path, is_math: options[i].is_math, math_expression: options[i].math_expression, sort_order: options[i].sort_order }, { transaction })
            } else {
              // update existing option
              await QuestionAnswerModel.update({ question_id: quesId, ans_desc: options[i].ans_desc, is_correct_ans: options[i].is_correct_ans, is_image: options[i].is_image, path: options[i].path, is_math: options[i].is_math, math_expression: options[i].math_expression, sort_order: options[i].sort_order }, { where: { id: getOptions[i].id, deleted_at: null } }, { transaction })
            }
            // if (getOptions.length === 4 && options.length === 5 && i === 4) {}
          }
        }
        await forLoop()
        await transaction.commit()

        var diffOptions = _.differenceWith(getOptions, options, function (o1, o2) {
          const optionId = parseInt(o2.id)
          return o1.id === optionId
        })

        // delete options that does not match
        for (let i = 0; i < diffOptions.length; i++) {
          // destroy
          await QuestionAnswerModel.destroy({ where: { id: diffOptions[i].id } })
          // await QuestionAnswerModel.update({ deleted_at: new Date() }, { where: { id: diffOptions[i].id } })
        }

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].question) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('question.createQuestion', error, req, res)
    }
  }

  async deleteQuestion(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await QuestionModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].question) })

      let transaction
      try {
        transaction = await sequelize.transaction()

        await QuestionModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } }, { transaction })
        await QuestionAnswerModel.update({ deleted_at: new Date() }, { raw: true, where: { question_id: id } }, { transaction })
        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].question) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('question.deleteQuestion', error, req, res)
    }
  }
}

module.exports = new QuestionService()
