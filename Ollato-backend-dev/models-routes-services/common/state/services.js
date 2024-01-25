const { catchError } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const StateModel = require('../../admin/state/state.model')

class StateService {
  async getAllStates(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { counrty_id } = req.body
      const states = await StateModel.findAll({ where: { county_id: counrty_id } })
      if (!states.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].state) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: states })
    } catch (error) {
      return await catchError('common.states', error, req, res)
    }
  }
}

module.exports = new StateService()
