const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const GradeModel = require('../../admin/grade/grade.model')

class GradeService {
  async getAllGrades(req, res) {
    try {
      const grades = await GradeModel.findAll({ where: { deleted_at: null } })
      if (!grades.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'grades') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: grades })
    } catch (error) {
      return await catchError('student.grade', error, req, res)
    }
  }
}

module.exports = new GradeService()
