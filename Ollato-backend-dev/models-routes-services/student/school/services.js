const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const SchoolModel = require('../../admin/school/schools.model')

class SchoolService {
  async getAllSchool(req, res) {
    try {
      const schools = await SchoolModel.findAll({ where: { deleted_at: null } })
      if (!schools.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'school') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: schools })
    } catch (error) {
      return await catchError('student.schools', error, req, res)
    }
  }
}

module.exports = new SchoolService()
