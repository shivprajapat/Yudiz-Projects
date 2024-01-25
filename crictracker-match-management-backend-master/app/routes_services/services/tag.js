const { players: PlayersModel, teams: TeamsModel, venues: VenuesModel } = require('../../model')

class Tag {
  async checkIdExist(req, res) {
    try {
      const { iId, eType } = req.query

      if (!iId || !eType || !['p', 't', 'v'].includes(eType)) return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: messages.english.inputRequired, data: null })

      let Model
      if (eType === 'p') Model = PlayersModel
      if (eType === 't') Model = TeamsModel
      if (eType === 'v') Model = VenuesModel

      const exist = await Model.findOne({ _id: iId }).lean()
      if (!exist) return res.status(messages.english.statusNotFound).jsonp({ status: messages.english.statusNotFound, message: messages.english.notFound.replace('##', 'data'), data: null })

      return res.status(messages.english.statusOk).jsonp({ status: messages.english.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'data'), data: exist })
    } catch (error) {
      return error
    }
  }
}

module.exports = new Tag()
