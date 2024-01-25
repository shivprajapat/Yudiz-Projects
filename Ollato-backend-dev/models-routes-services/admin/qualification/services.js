const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const QualificationModel = require('./qualification.model')
const { Op } = require('sequelize')

class QualificationService {
  async getQualificationById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await QualificationModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].qualification) })

      const qualifications = await QualificationModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: qualifications, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('qualification.getAllQualification', error, req, res)
    }
  }

  async getAllQualification(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const qualifications = await QualificationModel.findAll({
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
      const total = await QualificationModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: qualifications, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('qualification.getAllQualification', error, req, res)
    }
  }

  async createQualification(req, res) {
    try {
      removenull(req.body)
      const { title } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await QualificationModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].qualification) })

      const qualification = await QualificationModel.create({ custom_id: sCustomId, title })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: qualification, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].qualification) })
    } catch (error) {
      return await catchError('qualification.createQualification', error, req, res)
    }
  }

  async updateQualification(req, res) {
    try {
      const { title, id, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await QualificationModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await QualificationModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].qualification) })
        } else {
          const titleExist = await QualificationModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].qualification) })
          await QualificationModel.update({ title }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].qualification) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].qualification) })
      }
    } catch (error) {
      return await catchError('Qualification.updateQualification', error, req, res)
    }
  }

  async deleteQualification(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await QualificationModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].qualification) })

      const qualification = await QualificationModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } })
      if (qualification) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].qualification) })
    } catch (error) {
      return await catchError('qualification.deleteQualification', error, req, res)
    }
  }
}

module.exports = new QualificationService()
