const { catchError, removenull, randomStr, getPaginationValues } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const BoardModel = require('./board.model')
const { Op } = require('sequelize')
class BoardService {
  async getBoardById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await BoardModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].board) })

      const board = await BoardModel.findOne({
        where: {
          [Op.and]: [
            { id },
            { deleted_at: null }
          ]
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: board, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('board.getBoardByID', error, req, res)
    }
  }

  async getAllBoard(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const board = await BoardModel.findAll({
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
      const total = await BoardModel.findAndCountAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null
        }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: board, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('board.getAllBoard', error, req, res)
    }
  }

  async createBoard(req, res) {
    try {
      removenull(req.body)
      const { title } = req.body

      const sCustomId = randomStr(8, 'string')

      const exist = await BoardModel.findOne({ where: { title, deleted_at: null } })
      if (exist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].board) })

      const board = await BoardModel.create({ custom_id: sCustomId, title })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: board, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].board) })
    } catch (error) {
      return await catchError('board.createBoard', error, req, res)
    }
  }

  async updateBoard(req, res) {
    try {
      const { title, id, updateType, isActive } = req.body
      removenull(req.body)
      const exist = await BoardModel.findOne({ raw: true, where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          await BoardModel.update({ is_active: isActive }, { where: { id, deleted_at: null } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].board) })
        } else {
          const titleExist = await BoardModel.findAll({ raw: true, where: { id: { [Op.not]: id }, title, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].board) })
          await BoardModel.update({ title }, { where: { id: id } })
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].board) })
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].board) })
      }
    } catch (error) {
      return await catchError('grade.updateGrade', error, req, res)
    }
  }

  async deleteBoard(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await BoardModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].board) })

      const deletedAt = new Date()
      const grade = await BoardModel.update({ deleted_at: deletedAt }, { where: { id } })
      if (grade) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].board) })
    } catch (error) {
      return await catchError('board.deleteBoard', error, req, res)
    }
  }
}

module.exports = new BoardService()
