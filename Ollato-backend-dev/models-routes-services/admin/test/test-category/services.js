const { catchError, removenull, randomStr, getPaginationValues } = require('../../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../../helper/api.responses')
const TestCategoryModel = require('../../../student/test/test.model')
const TestDetailCategoryModel = require('../../../student/test/test.detail.model')
const { Op } = require('sequelize')
const { sequelize } = require('../../../../database/sequelize')

class TestCategoryService {
  async getTestCategoryById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await TestCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testCategory) })

      const testCategory = await TestCategoryModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testCategory, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('testCategory.getAllTestCategory', error, req, res)
    }
  }

  async getAllTestCategory(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const testCategories = await TestCategoryModel.findAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        order: sorting,
        limit,
        offset: start
      })
      const total = await TestCategoryModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testCategories, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('testCategory.getAllTestCategory', error, req, res)
    }
  }

  async getAllTestCategoryFront(req, res) {
    try {
      const testCategories = await TestCategoryModel.findAll({ where: { deleted_at: null } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testCategories, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('testCategory.getAllTestCategory', error, req, res)
    }
  }

  async createTestCategory(req, res) {
    try {
      removenull(req.body)
      const { title, description } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await TestCategoryModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].testCategory) })

      const testCategory = await TestCategoryModel.create({ custom_id: sCustomId, title, description })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: testCategory, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].testCategory) })
    } catch (error) {
      return await catchError('testCategory.createTestCategory', error, req, res)
    }
  }

  async updateTestCategory(req, res) {
    try {
      const { title, id, description, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await TestCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await TestCategoryModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testCategory) })
        } else {
          const titleExist = await TestCategoryModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].testCategory) })
          await TestCategoryModel.update({ title, description }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testCategory) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testCategory) })
      }
    } catch (error) {
      return await catchError('testCategory.updateTestCategory', error, req, res)
    }
  }

  async deleteTestCategory(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await TestCategoryModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testCategory) })

      let transaction
      try {
        transaction = await sequelize.transaction()
        await TestCategoryModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } }, { transaction })
        await TestDetailCategoryModel.update({ deleted_at: new Date() }, { raw: true, where: { test_id: id } }, { transaction })

        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].testCategory) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('testCategory.deleteTestCategory', error, req, res)
    }
  }
}

module.exports = new TestCategoryService()
