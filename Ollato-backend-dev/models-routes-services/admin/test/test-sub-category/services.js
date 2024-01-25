/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getPaginationValues } = require('../../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../../helper/api.responses')
const TestSubCategoryModel = require('../../../student/test/test.detail.model')
const TestModel = require('../../../student/test/test.model')
const { Op, Sequelize } = require('sequelize')

class TestSubCategoryService {
  async getTestSubCategoryById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await TestSubCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testSubCategory) })

      const testSubCategory = await TestSubCategoryModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testSubCategory, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('testSubCategory.getAllTestSubCategory', error, req, res)
    }
  }

  async getAllTestSubCategory(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const testCategories = await TestSubCategoryModel.findAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          },
          {
            '$tests.title$': {
              [Op.like]: `%${search}%`
            }
          }
          ],
          deleted_at: null
        },
        include: [{
          model: TestModel,
          as: 'tests',
          attributes: []
        }],
        attributes: ['id', 'title', 'sort_order', 'is_active', 'custom_id', [Sequelize.col('tests.id'), 'test_category_id'], [Sequelize.col('tests.title'), 'test_category']],
        order: sorting,
        limit,
        offset: start
      })
      const total = await TestSubCategoryModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          },
          {
            '$tests.title$': {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        include: [{
          model: TestModel,
          as: 'tests',
          attributes: []
        }
        ]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testCategories, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('testSubCategory.getAlltestSubCategory', error, req, res)
    }
  }

  async getAllTestSubCategoryFront(req, res) {
    try {
      const testCategories = await TestSubCategoryModel.findAll({
        where: { deleted_at: null },
        include: [{
          model: TestModel,
          as: 'tests',
          attributes: []
        }],
        attributes: ['id', 'title', 'sort_order', 'is_active', 'custom_id', [Sequelize.col('tests.id'), 'test_category_id'], [Sequelize.col('tests.title'), 'test_category']]
      })
      const total = await TestSubCategoryModel.findAndCountAll({
        where: { deleted_at: null },
        include: [{
          model: TestModel,
          as: 'tests',
          attributes: []
        }
        ]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testCategories, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('testSubCategory.getAlltestSubCategory', error, req, res)
    }
  }

  async createTestSubCategory(req, res) {
    try {
      removenull(req.body)
      const { title, test_id, sub_test_abb, no_of_questions, no_options, description, sort_order } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await TestSubCategoryModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].testSubCategory) })

      const testSubCategory = await TestSubCategoryModel.create({ custom_id: sCustomId, title, test_id, sub_test_abb, no_of_questions, no_options, description, sort_order })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testSubCategory, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].testSubCategory) })
    } catch (error) {
      return await catchError('testSubCategory.createTestSubCategory', error, req, res)
    }
  }

  async updateTestSubCategory(req, res) {
    try {
      const { id, title, test_id, no_options, sub_test_abb, no_of_questions, description, sort_order, isActive, updateType } = req.body
      removenull(req.body)

      const exist = await TestSubCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await TestSubCategoryModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testSubCategory) })
        } else {
          const titleExist = await TestSubCategoryModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].testSubCategory) })

          await TestSubCategoryModel.update({ title, test_id, sub_test_abb, no_of_questions, no_options, description, sort_order }, { where: { id: id } })

          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testSubCategory) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testSubCategory) })
      }
    } catch (error) {
      return await catchError('testSubCategory.updateTestSubCategory', error, req, res)
    }
  }

  async deleteTestSubCategory(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await TestSubCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testSubCategory) })

      const testSubCategory = await TestSubCategoryModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } })
      if (testSubCategory) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].testSubCategory) })
    } catch (error) {
      return await catchError('testSubCategory.deleteTestSubCategory', error, req, res)
    }
  }
}

module.exports = new TestSubCategoryService()
