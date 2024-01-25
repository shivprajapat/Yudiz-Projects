const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const GradeModel = require('./grade.model')
const { Op } = require('sequelize')

class GradeService {
  async getGradeById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await GradeModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].grade) })
      const grade = await GradeModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: grade, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('grade.getAllGrade', error, req, res)
    }
  }

  async getAllGrade(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const grade = await GradeModel.findAll({
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
      const total = await GradeModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: grade, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('grade.getAllGrade', error, req, res)
    }
  }

  async createGrade(req, res) {
    try {
      removenull(req.body)
      const { title } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await GradeModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].grade) })

      const grade = await GradeModel.create({ custom_id: sCustomId, title })
      if (grade) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: grade, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].grade) })
    } catch (error) {
      return await catchError('grade.createGrade', error, req, res)
    }
  }

  async updateGrade(req, res) {
    try {
      const { title, id, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await GradeModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await GradeModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].grade) })
        } else {
          const titleExist = await GradeModel.findAll({
            raw: true,
            where: { id: { [Op.not]: id }, title, deleted_at: null }
          })
          if (titleExist.length) return res.status(status.ResourceExist).jsonp({ status: status.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].grade) })
          await GradeModel.update({ title }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].grade) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].grade) })
      }
    } catch (error) {
      return await catchError('grade.updateGrade', error, req, res)
    }
  }

  async deleteGrade(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await GradeModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].grade) })

      const deletedAt = new Date()
      const grade = await GradeModel.update({ deleted_at: deletedAt }, { where: { id } })
      if (grade) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].grade) })
    } catch (error) {
      return await catchError('grade.deleteGrade', error, req, res)
    }
  }
}

module.exports = new GradeService()
