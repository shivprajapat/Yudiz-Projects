const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const PromocodeModel = require('../model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { catchError, getPaginationValues, handleCatchError } = require('../../../helper/utilities.services')
const PromocodeStatisticModel = require('../statistics/model')

class PromocodeStatistic {
  async logStats({
    iUserId,
    iPromocodeId,
    sTransactionType,
    nAmount,
    idepositId
  }) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await PromocodeStatisticModel.create(
            {
              iUserId,
              iPromocodeId,
              nAmount,
              sTransactionType,
              idepositId
            }
          )
          return resolve({ isSuccess: true })
        } catch (error) {
          handleCatchError(error)
          return resolve({ isSuccess: false })
        }
      })()
    })
  }

  async getV2(req, res) {
    try {
      const { iUserId } = req.query
      let { start, limit, sorting } = getPaginationValues(req.query)
      start = parseInt(start)
      limit = parseInt(limit)

      const promo = await PromocodeModel.findById(req.params.id).lean()
      if (!promo) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cpromocode) })

      const query = { iPromocodeId: ObjectId(req.params.id) }
      if (iUserId) query.iUserId = ObjectId(iUserId)

      const total = await PromocodeStatisticModel.countDocuments(query)
      const promoUsageData = await PromocodeStatisticModel.find(query)
        .populate({ path: 'iUserId', select: ['sUsername', 'sMobNum', '_id', 'eType'] })
        .populate({ path: 'iMatchId', select: ['sName', '_id'] })
        .sort(sorting).skip(start).limit(limit).lean()

      if (!promoUsageData.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].cpromocode) })

      const totalBonus = await PromocodeStatisticModel.aggregate([
        {
          $match: {
            iPromocodeId: promo._id
          }
        },
        {
          $group: {
            _id: null,
            bonus: {
              $sum: '$nAmount'
            }
          }
        }
      ])

      const sCode = promo.sCode
      const data = { total, ntotalBonusGiven: totalBonus ? totalBonus[0].bonus : 0, sCode, data: promoUsageData }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].cpromocodeStatistic), data: data })
    } catch (error) {
      return catchError('Promocode.getV2', error, req, res)
    }
  }
}

module.exports = new PromocodeStatistic()
