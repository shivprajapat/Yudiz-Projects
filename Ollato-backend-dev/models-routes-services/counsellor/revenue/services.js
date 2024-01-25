/* eslint-disable camelcase */
const moment = require('moment')
const { status, jsonStatus, messages } = require('../../../helper/api.responses')
const { catchError, removenull } = require('../../../helper/utilities.services')
const CounsellorRevenueModel = require('./counsellor_revenue.model')
const CounsellorModel = require('../counsellor.model')
const { Op, Sequelize } = require('sequelize')

class CounsellorRevenueServices {
  async getCounsellorRevenue(req, res) {
    try {
      removenull(req.body)
      const { duration } = req.body
      // current_month, last_month, last_three_months, last_year
      const query = { where: { counsellor_id: req.user.id } }

      // default current_month
      let startDate = moment().startOf('month').format()
      let endDate = moment().format()

      Object.assign(query.where.created_at = { [Op.between]: [startDate, endDate] })
      Object.assign(query.attributes = [[Sequelize.fn('sum', Sequelize.col('amount')), 'total_revenue_amount']])

      if (duration) {
        switch (duration) {
          case 'last_month':
            startDate = moment().startOf('month').subtract(1, 'months').format()
            endDate = moment().startOf('month').subtract(1, 'day').format()
            break
          case 'last_three_months':
            startDate = moment().startOf('month').subtract(3, 'months').format()
            break
          case 'last_year':
            startDate = moment().subtract(12, 'months').format()
            break
          default: break
        }
        Object.assign(query.where.created_at = { [Op.between]: [startDate, endDate] })
      }
      const revenue = await CounsellorRevenueModel.findAll(query)
      const remaining_amount = await CounsellorModel.findOne({ where: { id: req.user.id }, attributes: ['remaining_amount'] })

      const totalRevenueAmount = revenue[0].dataValues.total_revenue_amount
      const remainingAmount = remaining_amount.dataValues.remaining_amount

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: { totalRevenueAmount, remainingAmount }, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('counsellor.counsellorSupport', error, req, res)
    }
  }
}

module.exports = new CounsellorRevenueServices()
