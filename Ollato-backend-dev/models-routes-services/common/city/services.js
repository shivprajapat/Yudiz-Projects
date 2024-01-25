const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CityModel = require('../../admin/city/city.model')

class CityService {
  async getAllCities(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { state_id } = req.body
      const cities = await CityModel.findAll({ where: { state_id } })
      if (!cities.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].city) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: cities })
    } catch (error) {
      return await catchError('common.citie', error, req, res)
    }
  }
}

module.exports = new CityService()
