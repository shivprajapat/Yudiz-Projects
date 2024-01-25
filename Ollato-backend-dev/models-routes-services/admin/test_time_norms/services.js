const testTimeNormsModel = require('./test.time.norms.model')
const { status, messages, jsonStatus } = require('../../../helper/api.responses')
const { catchError, getPaginationValues, removenull, getUniqueString } = require('../../../helper/utilities.services')
const gradeModel = require('../grade/grade.model')
const testDetailModel = require('../../student/test/test.detail.model')
const testModel = require('../../student/test/test.model')
const { Op, Sequelize } = require('sequelize')
class TestTimeModel {
  async getAllTestTimeNorms(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const timeNorms = await testTimeNormsModel.findAndCountAll({
        where: {
          [Op.or]: [
            {
              time_Sec: {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$grades.title$': {
                [Op.like]: `%${search}%`
              }
            },
            {
              '$test_details.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ],
          deleted_at: null
        },
        include: [{
          model: gradeModel,
          as: 'grades',
          attributes: []
        },
        {
          model: testDetailModel,
          as: 'test_details',
          attributes: []
        }],
        attributes: ['id', 'test_detail_id', 'grade_id', 'time_Sec', [Sequelize.col('grades.title'), 'grade'], [Sequelize.col('test_details.title'), 'sub-test-name'], 'is_active'],
        order: sorting,
        limit,
        offset: start
      })
      res.status(status.OK).jsonp({ status: jsonStatus.OK, data: timeNorms, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].testTimeNorms) })
    } catch (error) {
      catchError('createTestTimeNorms', error, req, res)
    }
  }

  async getTestTimeNormsById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const timeNorms = await testTimeNormsModel.findOne({
        where: { id, deleted_at: null },
        include: [
          {
            model: testDetailModel,
            as: 'test_details',
            attributes: ['id', 'title'],
            include: [
              {
                model: testModel,
                as: 'tests',
                attributes: ['id', 'title']
              }
            ]
          }
        ]
      })

      if (!timeNorms) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testTimeNorms) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: timeNorms, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].testTimeNorms) })
    } catch (error) {
      return await catchError('testTimeNorms.getAllPackage', error, req, res)
    }
  }

  async subTest(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const subTest = await testDetailModel.findAll({ where: { test_id: id, deleted_at: null, is_active: 'y' }, attributes: { exclude: ['created_at', 'updated_at', 'created_by', 'updated_by', 'sort_order', 'description', 'synopsis', 'meaning', 'no_options', 'no_of_questions'] } })
      if (!subTest) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testSubCategory) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: subTest, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].testSubCategory) })
    } catch (error) {
      return await catchError('testSubCategory.getAllPackage', error, req, res)
    }
  }

  async getSubTest(req, res) {
    try {
      const subTest = await testDetailModel.findAll({ where: { deleted_at: null, is_active: 'y' }, attributes: { exclude: ['created_at', 'updated_at', 'created_by', 'updated_by', 'sort_order', 'description', 'synopsis', 'meaning', 'no_options', 'no_of_questions'] } })
      if (!subTest) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testSubCategory) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: subTest, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].testSubCategory) })
    } catch (error) {
      return await catchError('testSubCategory.getAllPackage', error, req, res)
    }
  }

  async createTestTimeNorms(req, res) {
    try {
      removenull(req.body)
      const {
        testDetailId,
        gradeId,
        timeSec
      } = req.body
      const customId = await getUniqueString(8, testTimeNormsModel)
      const createdPackage = await testTimeNormsModel.create({ custom_id: customId, test_detail_id: testDetailId, grade_id: gradeId, time_Sec: timeSec })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: createdPackage, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].testTimeNorms) })
    } catch (error) {
      return await catchError('packages.createPackage', error, req, res)
    }
  }

  async updateTestTimeNorms(req, res) {
    try {
      const { testDetailId, gradeId, timeSec, id, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await testTimeNormsModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await testTimeNormsModel.update({ is_active: isActive }, { where: { id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testTimeNorms) })
        } else {
          await testTimeNormsModel.update({ test_detail_id: testDetailId, grade_id: gradeId, time_Sec: timeSec }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].testTimeNorms) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testTimeNorms) })
      }
    } catch (error) {
      return await catchError('testTimeNorms.update', error, req, res)
    }
  }

  async deleteTestTimeNorms(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await testTimeNormsModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].testTimeNorms) })

      const deletedAt = new Date()
      const grade = await testTimeNormsModel.update({ deleted_at: deletedAt }, { where: { id } })
      if (grade) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].testTimeNorms) })
    } catch (error) {
      return await catchError('grade.deleteGrade', error, req, res)
    }
  }
}

module.exports = new TestTimeModel()
