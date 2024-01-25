const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const UnisversityModel = require('../../admin/university/university.model')

class UniversityService {
  async getAllUniversity(req, res) {
    try {
      const universities = await UnisversityModel.findAll()
      if (!universities.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'university') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: universities })
    } catch (error) {
      return await catchError('common.university', error, req, res)
    }
  }
}

module.exports = new UniversityService()
