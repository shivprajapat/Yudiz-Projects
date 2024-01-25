/* eslint-disable camelcase */
const { status, jsonStatus, messages } = require('../../../../helper/api.responses')
const { catchError, removenull, getPaginationValues } = require('../../../../helper/utilities.services')
const CounsellorModel = require('../../../counsellor/counsellor.model')
const CounsellorRedeemModel = require('../../../counsellor/redeem/counsellor_redeem.model')
const { sequelize } = require('../../../../database/sequelize')
const { Op } = require('sequelize')

class CounsellorRedeemServices {
  async getAllRedeemRequest(req, res) {
    try {
      removenull(req.body)
      const { redeemStatus } = req.body
      const { start, limit, sorting, search } = getPaginationValues(req.body)

      const query = {
        where: {
          [Op.or]: [{
            status: {
              [Op.like]: `%${search}%`
            }
          },
          {
            '$counsellors.first_name$': {
              [Op.like]: `%${search}%`
            }
          },
          {
            '$counsellors.last_name$': {
              [Op.like]: `%${search}%`
            }
          }]
        },
        include: [{
          model: CounsellorModel,
          as: 'counsellors',
          attributes: ['id', 'first_name', 'last_name', 'email', 'mobile']
        }],
        order: sorting,
        limit,
        offset: start
      }

      if (redeemStatus) query.where.status = redeemStatus

      const countAll = await CounsellorRedeemModel.findAndCountAll(query)

      if (countAll.count !== 0) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: countAll, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].revenue) })
    } catch (error) {
      return await catchError('redeem.getAllRequest', error, req, res)
    }
  }

  async redeemRequestById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const query = {
        where: { id },
        include: [{
          model: CounsellorModel,
          as: 'counsellors',
          attributes: ['id', 'first_name', 'last_name', 'email', 'mobile']
        }]
      }
      const request = await CounsellorRedeemModel.findOne(query)

      if (request) return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: request, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('counsellor.counsellorRemption', error, req, res)
    }
  }

  // update redeem status
  async updateRedeemRequest(req, res) {
    try {
      removenull(req.body)
      const { id, redeemStatus, amount, counsellor_id, receipt } = req.body
      const amt = parseFloat(amount)

      const redeem = await CounsellorRedeemModel.findOne({ where: { id }, attributes: ['status', 'receipt'] })

      if (redeem.status === 'rejected') return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_allow })

      if (redeemStatus === 'pending' || redeemStatus === 'paid') {
        await CounsellorRedeemModel.update({ updated_at: new Date(), receipt, status: redeemStatus }, { where: { id } })

        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].redumptionRequest) })
      }

      if (redeemStatus === 'rejected' && redeem.status !== 'paid') {
        let transaction
        try {
          transaction = await sequelize.transaction()

          await CounsellorModel.increment({ redeem_amount: -amt }, { where: { id: counsellor_id } }, { transaction })
          await CounsellorModel.increment({ remaining_amount: +amt }, { where: { id: counsellor_id } }, { transaction })
          await CounsellorRedeemModel.update({ updated_at: new Date(), status: redeemStatus, receipt: null }, { where: { id } }, { transaction })

          await transaction.commit()

          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].redumptionRequest) })
        } catch (error) {
          if (transaction) await transaction.rollback()
          return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
        }
      } else {
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].already_paid.replace('##', messages[req.userLanguage].redumptionRequest) })
      }
    } catch (error) {
      return await catchError('counsellor.updateCousellorRedumption', error, req, res)
    }
  }
}

module.exports = new CounsellorRedeemServices()
