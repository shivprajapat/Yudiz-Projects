const moment = require('moment')
const { players: PlayersModel } = require('../models/index')

class MatchService {
  async updatePlayersBirthDate(req, res) {
    try {
      const players = await PlayersModel.find({}).limit(1)
      for (const player of players) {
        const birthDate = moment(null).add(330, 'minutes').toDate()
        console.log({ birthDate, player })
        // await PlayersModel.findOneAndUpdate({ _id: player._id }, { dBirthDate: birthDate })
      }
      return res.send({ status: 'ok' })
    } catch (error) {
      console.log(error)
      return res.send({ error })
    }
  }
}

module.exports = new MatchService()
