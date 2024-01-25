const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const BoardModel = require('../../admin/board/board.model')

class BoardService {
  async getAllBoard(req, res) {
    try {
      const board = await BoardModel.findAll({ where: { deleted_at: null } })
      if (!board.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'board') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: board })
    } catch (error) {
      return await catchError('student.borads', error, req, res)
    }
  }
}

module.exports = new BoardService()
