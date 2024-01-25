const BotLogModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { getPaginationValues } = require('../../helper/utilities.services')
const { findAdmins } = require('./grpc/clientServices')

class BotLog {
  async getContestLogs(req, res) {
    try {
      const { start, limit, sorting } = getPaginationValues(req.query)
      const query = { iMatchLeagueId: ObjectId(req.params.id) }

      if (req.query.eType) query.eType = req.query.eType

      let [nTotal, aData] = await Promise.all([
        BotLogModel.countDocuments(query),
        BotLogModel.find(query).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()
      ])

      const aAdminId = aData.map(id => id.iAdminId)
      const adminData = await findAdmins({ _id: { $in: aAdminId } }, { sUsername: 1 })

      aData = aData.map(data => {
        const oAdmin = adminData.find(a => a._id.toString() === data.iAdminId.toString())
        return { ...data, oAdmin }
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cBotLogs), data: { aData, nTotal } })
    } catch (error) {
      return catchError('BotLog.getLogs', error, req, res)
    }
  }
}

module.exports = new BotLog()
