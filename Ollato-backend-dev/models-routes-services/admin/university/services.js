const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const UniversityModel = require('./university.model')
const { Op } = require('sequelize')

class UniversityService {
  async getUniversityById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await UniversityModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].university) })

      const universities = await UniversityModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: universities, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].university) })
    } catch (error) {
      return await catchError('university.getAllUniversity', error, req, res)
    }
  }

  async getAllUniversity(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const universities = await UniversityModel.findAll({
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
      const total = await UniversityModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: universities, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('university.getAllUniversity', error, req, res)
    }
  }

  async createUniversity(req, res) {
    try {
      removenull(req.body)
      const { title } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await UniversityModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].university) })

      const university = await UniversityModel.create({ custom_id: sCustomId, title })
      if (university) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: university, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].university) })
    } catch (error) {
      return await catchError('university.createUniversity', error, req, res)
    }
  }

  async updateUniversity(req, res) {
    try {
      const { title, id, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await UniversityModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await UniversityModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].university) })
        } else {
          const titleExist = await UniversityModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].university) })
          await UniversityModel.update({ title }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].university) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].university) })
      }
    } catch (error) {
      return await catchError('university.updateUniversity', error, req, res)
    }
  }

  async deleteUniversity(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await UniversityModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].university) })

      const deletedAt = new Date()
      const university = await UniversityModel.update({ deleted_at: deletedAt }, { where: { id: id } })
      if (university) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].university) })
    } catch (error) {
      return await catchError('university.deleteUniversity', error, req, res)
    }
  }
}

module.exports = new UniversityService()
