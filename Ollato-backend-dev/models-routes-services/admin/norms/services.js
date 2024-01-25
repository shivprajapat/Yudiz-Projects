/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const NormsModel = require('./norms.model')
const { Op } = require('sequelize')

class NormsService {
  async getNormsById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await NormsModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].norm) })

      const norms = await NormsModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: norms, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('norm.getAllNorm', error, req, res)
    }
  }

  async getAllNorms(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const norms = await NormsModel.findAll({
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
      const total = await NormsModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: norms, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('norm.getAllNorms', error, req, res)
    }
  }

  async getAllNormsFrontend(req, res) {
    try {
      removenull(req.body)
      const norms = await NormsModel.findAll({ where: { deleted_at: null } })
      if (!norms.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'norms') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: norms })
    } catch (error) {
      return await catchError('norm.getAllNorms', error, req, res)
    }
  }

  async createNorm(req, res) {
    try {
      removenull(req.body)
      const { title, code, sort_order } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await NormsModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].norm) })

      const norm = await NormsModel.create({ custom_id: sCustomId, title, code, sort_order })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: norm, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].norm) })
    } catch (error) {
      return await catchError('norm.createNorm', error, req, res)
    }
  }

  async updateNorm(req, res) {
    try {
      const { title, id, code, sort_order, updateType, isActive } = req.body
      removenull(req.body)

      const exist = await NormsModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await NormsModel.update({ is_active: isActive }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].norm) })
        } else {
          const titleExist = await NormsModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].norm) })

          await NormsModel.update({ title, code, sort_order }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].norm) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].norm) })
      }
    } catch (error) {
      return await catchError('norm.updateNorm', error, req, res)
    }
  }

  async deleteNorms(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await NormsModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].norm) })

      const norm = await NormsModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } })
      if (norm) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].norm) })
    } catch (error) {
      return await catchError('norm.deleteNorm', error, req, res)
    }
  }
}

module.exports = new NormsService()
