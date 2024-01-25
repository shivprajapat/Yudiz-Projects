
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError } = require('../../helper/utilities.services')
const UserDepositModel = require('../userDeposit/model')
const UserWithdrawModel = require('../userWithdraw/model')
const { Op } = require('sequelize')
const { checkCashfreePayoutStatus, processPayout, checkCashfreeStatus, processPayment } = require('./common')

class Cron {
  /**
   * This service will want system to check Pending Deposits every hour,
   * so that if any webhook missed still that payment will be proceed and transaction will be either success or failed rather then being pending in admin panel.
   * @param {*} req request object
   * @param {*} res response object
   * @returns This will process all pending deposit which webhooks are missed to be execute for certain reason.
   */
  async processDepositPayment(req, res) {
    try {
      const dCurrentTime = new Date()
      dCurrentTime.setTime(dCurrentTime.getTime() - (60 * 60 * 1000))

      const data = await UserDepositModel.findAll({
        where: {
          ePaymentStatus: 'P',
          [Op.and]: [{
            dUpdatedAt: { [Op.gte]: dCurrentTime }
          }, {
            dUpdatedAt: { [Op.lte]: new Date(new Date().getTime() - (5 * 60 * 1000)) } // 5 minutes before from current time.
          }]
        },
        raw: true,
        order: [['dUpdatedAt', 'DESC']]
      })

      for (const deposit of data) {
        const { id, ePaymentGateway } = deposit
        if (ePaymentGateway === 'CASHFREE') {
          const { isSuccess, payload, error } = await checkCashfreeStatus(id)
          if (!isSuccess) {
            throw new Error(error)
          }
          await processPayment(deposit, payload)
        }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].processDepositPayment) })
    } catch (error) {
      catchError('Cron.processDepositPayment', error, req, res)
    }
  }

  /**
   * This service will want system to check Initiated payout for every hour,
   * so that if any withdraw that is approved by admin and Transfer request triggered but No response from bank in that case will check payout status and will be update either success or failed.
   * @param {*} req request object
   * @param {*} res response object
   * @returns This will process all initiated withdraw which are having no response from bank or any certain reason to be executed in this service.
   */
  async processInitiatedPayouts(req, res) {
    try {
      const dCurrentTime = new Date()
      dCurrentTime.setTime(dCurrentTime.getTime() - (60 * 60 * 1000))

      const data = await UserWithdrawModel.findAll({
        where: {
          ePaymentStatus: 'I',
          [Op.and]: [{
            dUpdatedAt: { [Op.gte]: dCurrentTime }
          }, {
            dUpdatedAt: { [Op.lte]: new Date() }
          }]
        },
        raw: true,
        order: [['dUpdatedAt', 'DESC']]
      })

      for (const withdraw of data) {
        const { id, ePaymentGateway } = withdraw
        if (ePaymentGateway === 'CASHFREE') {
          const { isSuccess, payload, error } = await checkCashfreePayoutStatus(id)
          if (!isSuccess) {
            throw new Error(error)
          }
          await processPayout(withdraw, payload)
        }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].successfully.replace('##', messages[req.userLanguage].processInitiatePayout) })
    } catch (error) {
      catchError('Cron.processInitiatedPayouts', error, req, res)
    }
  }
}

module.exports = new Cron()
