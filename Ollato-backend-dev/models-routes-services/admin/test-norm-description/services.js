/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const TestNormDescModel = require('./test-norm-desc.model')
const TestModel = require('../../student/test/test.model')
const TestDetailModel = require('../../student/test/test.detail.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')

class NormGradeServices {
  async getTestNormDescById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const norms = await TestNormDescModel.findOne({
        where: { id, deleted_at: null },
        include: [
          {
            model: TestDetailModel,
            as: 'test_details',
            attributes: ['id', 'title']
          },
          {
            model: TestModel,
            as: 'tests',
            attributes: ['id', 'title']
          }]
      })
      if (!norms) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testNormDescription) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: norms, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].testNormDescription) })
    } catch (error) {
      return await catchError('norms.getAllTestNormDescModel', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const total = await TestNormDescModel.count({
        where: {
          [Op.or]: [{
            '$tests.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$test_details.title$': {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        include: [
          {
            model: TestModel,
            as: 'tests',
            attributes: []
          },
          {
            model: TestDetailModel,
            as: 'test_details',
            attributes: []
          }
        ]
      })
      const normGrades = await TestNormDescModel.findAll({
        where: {
          [Op.or]: [{
            '$tests.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$test_details.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            norm: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        include: [
          {
            model: TestModel,
            as: 'tests',
            attributes: []
          },
          {
            model: TestDetailModel,
            as: 'test_details',
            attributes: []
          }],
        attributes: ['id', 'custom_id', 'test_id', 'test_detail_id', 'norm_id', 'norm', 'is_active', [Sequelize.col('tests.title'), 'test_title'], [Sequelize.col('test_details.title'), 'test_details_title'], [Sequelize.col('test_details.sub_test_abb'), 'test_details_sub_test_abb'], [Sequelize.col('test_details.no_of_questions'), 'test_details_no_of_questions'], [Sequelize.col('test_details.no_options'), 'test_details_no_options'], [Sequelize.col('test_details.description'), 'test_details_description']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: normGrades, total, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('normGRades.getNormGrades', error, req, res)
    }
  }

  async createTestNormDesc(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { test_id, test_detail_id, norm_id, norm, description, plan_of_action } = req.body

      const customId = await getUniqueString(8, TestNormDescModel)
      const testNormDesc = await TestNormDescModel.create({ custom_id: customId, test_id, test_detail_id, norm_id, norm, description, plan_of_action })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testNormDesc, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].testNormDescription) })
    } catch (error) {
      return await catchError('normGrade.createTestNormDesc', error, req, res)
    }
  }

  async updateTestNormDesc(req, res) {
    try {
      removenull(req.body)
      // eslint-disable-next-line camelcase
      const { test_id, test_detail_id, norm_id, norm, description, plan_of_action, id, isActive, updateType } = req.body

      const exist = await TestNormDescModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await TestNormDescModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testNormDescription) })
        } else {
          await TestNormDescModel.update({ test_id, test_detail_id, norm_id, norm, description, plan_of_action }, { where: { id: id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testNormDescription) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testNormDescription) })
      }
    } catch (error) {
      return await catchError('testNormDesc.updateTestNormDesc', error, req, res)
    }
  }

  async deleteTestNormDesc(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      await TestNormDescModel.update({ deleted_at: new Date() }, { where: { id: id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].testNormDescription) })
    } catch (error) {
      return await catchError('testNormDesc.deletTestNormDesc', error, req, res)
    }
  }
}
module.exports = new NormGradeServices()
