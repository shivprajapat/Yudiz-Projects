const UserWithdrawModel = require('../model')
const { fn, col, Op } = require('sequelize')
const { handleCatchError } = require('../../../helper/utilities.services')

async function countWithdraw (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }
    const data = await UserWithdrawModel.findAndCountAll(query)
    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function findWithdraw (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }
    const data = await UserWithdrawModel.findOne(query)
    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

/**
 * get  payment gateway wise  sum of withdraw amount
 * @returns {Array} ie. [{ "eTitle": "CASHFREE", "nValue": 33481 },{ "eTitle": "ADMIN", "nValue": 34406 }]
 */
async function getWithdrawOfPG (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    query = { ...query, attributes: [['ePaymentGateway', 'eTitle'], [fn('sum', col('nAmount')), 'nValue']] }
    query.where = { ...query.where, ePaymentGateway: { [Op.ne]: '' } }

    const data = await UserWithdrawModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

/**
 * get  payment gateway wise  sum of withdraw amount in between date range
 * @returns {Array} ie. [{ "eTitle": "CASHFREE", "nValue": 33481 },{ "eTitle": "ADMIN", "nValue": 34406 }]
 */
async function getDateRangeWithdrawOfPG (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    const dateRange = call.request.dateRange ? JSON.parse(call.request.dateRange) : { dStartDate: new Date(), dEndDate: new Date() }
    const { dStartDate, dEndDate } = dateRange

    query = { ...query, attributes: [['ePaymentGateway', 'eTitle'], [fn('sum', col('nAmount')), 'nValue']] }
    query.where = { ...query.where, ePaymentGateway: { [Op.ne]: '' }, [Op.and]: [{ dCreatedAt: { [Op.gte]: dStartDate } }, { dCreatedAt: { [Op.lt]: dEndDate } }] }

    const data = await UserWithdrawModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

module.exports = {
  findWithdraw,
  getWithdrawOfPG,
  countWithdraw,
  getDateRangeWithdrawOfPG
}
