/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const NormGradeModel = require('./norm-grades.model')
const TestModel = require('../../student/test/test.model')
const TestDetailModel = require('../../student/test/test.detail.model')
const NormModel = require('../norms/norms.model')
const GradeModel = require('../grade/grade.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')

class NormGradeServices {
  async getNormGradesById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const norms = await NormGradeModel.findOne({
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
      if (!norms) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].normGrade) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: norms, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].normGrade) })
    } catch (error) {
      return await catchError('norms.getAllNorms', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const total = await NormGradeModel.count({
        where: {
          [Op.or]: [{
            '$grades.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$tests.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$test_details.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$norms.title$': {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        include: [{
          model: GradeModel,
          as: 'grades',
          attributes: []
        },
        {
          model: TestModel,
          as: 'tests',
          attributes: []
        },
        {
          model: TestDetailModel,
          as: 'test_details',
          attributes: []
        },
        {
          model: NormModel,
          as: 'norms',
          attributes: []
        }
        ]
      })
      const normGrades = await NormGradeModel.findAll({
        where: {
          [Op.or]: [{
            '$grades.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$tests.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$test_details.title$': {
              [Op.like]: `%${search}%`
            }
          }, {
            '$norms.title$': {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        },
        include: [{
          model: GradeModel,
          as: 'grades',
          attributes: []
        },
        {
          model: TestModel,
          as: 'tests',
          attributes: []
        },
        {
          model: TestDetailModel,
          as: 'test_details',
          attributes: []
        },
        {
          model: NormModel,
          as: 'norms',
          attributes: []
        }],
        attributes: ['id', 'custom_id', 'grade_id', 'test_id', 'test_detail_id', 'norm_id', 'min_marks', 'max_marks', 'is_active', [Sequelize.col('grades.title'), 'grade_title'], [Sequelize.col('tests.title'), 'test_title'], [Sequelize.col('test_details.title'), 'test_details_title'], [Sequelize.col('test_details.sub_test_abb'), 'test_details_sub_test_abb'], [Sequelize.col('test_details.no_of_questions'), 'test_details_no_of_questions'], [Sequelize.col('test_details.no_options'), 'test_details_no_options'], [Sequelize.col('test_details.description'), 'test_details_description'], [Sequelize.col('norms.title'), 'norms_title']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: normGrades, total, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('normGRades.getNormGrades', error, req, res)
    }
  }

  async createNormGrade(req, res) {
    try {
      removenull(req.body)
      const { grade_id, test_id, test_detail_id, norm_id, min_marks, max_marks } = req.body

      const customId = await getUniqueString(8, NormGradeModel)
      const normGrade = await NormGradeModel.create({ custom_id: customId, grade_id, test_id, test_detail_id, norm_id, min_marks, max_marks })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: normGrade, message: messages[req.userLanguage].generate_success.replace('##', messages[req.userLanguage].normGrade) })
    } catch (error) {
      return await catchError('normGrade.createNormGrade', error, req, res)
    }
  }

  async updateNormGrade(req, res) {
    try {
      removenull(req.body)
      const { grade_id, test_id, test_detail_id, norm_id, min_marks, max_marks, id, updateType, isActive } = req.body

      const exist = await NormGradeModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await NormGradeModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].normGrade) })
        } else {
          const normGrades = await NormGradeModel.update({ grade_id, test_id, test_detail_id, norm_id, min_marks, max_marks }, { where: { id: id, deleted_at: null } })
          if (normGrades) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].normGrade) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].normGrade) })
      }
    } catch (error) {
      return await catchError('normGrades.updateNormGrades', error, req, res)
    }
  }

  async deleteNormGrade(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await NormGradeModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].normGrade) })

      await NormGradeModel.update({ deleted_at: new Date() }, { where: { id: id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].normGrade) })
    } catch (error) {
      return await catchError('normGrade.deleteNormGrade', error, req, res)
    }
  }
}
module.exports = new NormGradeServices()
