/* eslint-disable camelcase */
const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError, removenull, getPaginationValues } = require('../../../helper/utilities.services')
const CounsellorModel = require('../counsellor.model')
const CounsellorRedeemModel = require('./counsellor_redeem.model')
const { Op } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')

class CounsellorRedeemServices {
  async counsellorRedeemRequest(req, res) {
    try {
      removenull(req.body)
      const { amount } = req.body

      const query = { where: { id: req.user.id, remaining_amount: { [Op.gte]: amount } } }
      const revenue = await CounsellorModel.findOne(query)

      if (revenue) {
        let transaction
        try {
          transaction = await sequelize.transaction()

          await CounsellorModel.increment({ redeem_amount: +amount }, { where: { id: req.user.id } }, { transaction })
          await CounsellorModel.increment({ remaining_amount: -amount }, { where: { id: req.user.id } }, { transaction })
          await CounsellorRedeemModel.create({ counsellor_id: req.user.id, amount, date: new Date() }, { transaction })

          await transaction.commit()
        } catch (error) {
          if (transaction) await transaction.rollback()
          return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
        }
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].revenue_not_sufficiant })
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].sent_success.replace('##', messages[req.userLanguage].redumptionRequest) })
    } catch (error) {
      return await catchError('counsellor.counsellorRemption', error, req, res)
    }
  }

  async getAllRedeemRequest(req, res) {
    try {
      removenull(req.body)
      const { redeemStatus } = req.body
      const { start, limit, sorting } = getPaginationValues(req.body)

      const query = {
        where: { counsellor_id: req.user.id },
        order: sorting,
        limit,
        offset: start
      }
      if (redeemStatus) query.where.status = redeemStatus

      const countAll = await CounsellorRedeemModel.findAndCountAll(query)

      if (countAll.count !== 0) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].revenue) })
    } catch (error) {
      return await catchError('counsellor.getAll', error, req, res)
    }
  }

  async redeemRequestById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const query = { where: { id } }
      const request = await CounsellorRedeemModel.findOne(query)

      if (request) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: request, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('counsellor.counsellorRemption', error, req, res)
    }
  }
}

module.exports = new CounsellorRedeemServices()
