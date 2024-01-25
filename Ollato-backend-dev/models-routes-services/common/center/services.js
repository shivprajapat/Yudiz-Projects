const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CenterModel = require('../../center/Auth/center.model')

class CenterService {
  async getAllCenter(req, res) {
    try {
      const centers = await CenterModel.findAll({ where: { is_active: 'y', deleted_at: null } })
      if (!centers.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].center) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: centers })
    } catch (error) {
      return await catchError('common.centers', error, req, res)
    }
  }
}

module.exports = new CenterService()
