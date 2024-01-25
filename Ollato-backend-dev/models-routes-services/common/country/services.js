const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CountryModel = require('./country.model')

class CountryService {
  async getAllCountry(req, res) {
    try {
      const countries = await CountryModel.findAll({ where: { is_active: 'y' } })
      if (!countries.length) res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'country') })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: countries })
    } catch (error) {
      return await catchError('common.countries', error, req, res)
    }
  }
}

module.exports = new CountryService()
