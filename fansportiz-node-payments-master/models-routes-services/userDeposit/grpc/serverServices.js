const UserDepositModel = require('../model')
const db = require('../../../database/sequelize')
const { fn, col, Op } = require('sequelize')
const { handleCatchError } = require('../../../helper/utilities.services')

async function findDeposit (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }
    const data = await UserDepositModel.findOne(query)
    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function findAllDeposit (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    const data = await UserDepositModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function countDeposit (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }
    const { count } = await UserDepositModel.findAndCountAll(query)

    callback(null, { data: JSON.stringify(count) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
/**
 * get total of nCash
 * @returns {Array} ie [{total:1000}]
 */
async function findTotalCashDeposit (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    query = { ...query, attributes: [[fn('sum', col('nCash')), 'total']] }

    const data = await UserDepositModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

/**
 * get payment gateway wise total deposit cash
 * @returns {Array} ie. [{ "eTitle": "CASHFREE", "nValue": 33481 },{ "eTitle": "ADMIN", "nValue": 34406 }]
 */
async function getDepositOfPG (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    query = { ...query, attributes: [['ePaymentGateway', 'eTitle'], [fn('sum', col('nCash')), 'nValue']] }
    query.where = { ...query.where, ePaymentGateway: { [Op.ne]: '' } }

    const data = await UserDepositModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

/**
 * get total sum of nCash between two date return
 * @returns {Array} i.e. [{ total: 1000}]
 */
async function getDepositOfDateRange (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    const dateRange = call.request.dateRange ? JSON.parse(call.request.dateRange) : { dStartDate: new Date(), dEndDate: new Date() }
    const { dStartDate, dEndDate } = dateRange

    query = { ...query, attributes: [[fn('sum', col('nCash')), 'total']] }
    query.where = { ...query.where, [Op.and]: [{ dCreatedAt: { [Op.gte]: dStartDate } }, { dCreatedAt: { [Op.lt]: dEndDate } }] }

    const data = await UserDepositModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

/**
 * get payment gateway wise total deposit cash between two dates
 * @returns {Array} ie [{ "eTitle": "CASHFREE", "nValue": 33481 },{ "eTitle": "ADMIN", "nValue": 34406 }]
 */
async function getDepositOfPgInDateRange (call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }

    const dateRange = call.request.dateRange ? JSON.parse(call.request.dateRange) : { dStartDate: new Date(), dEndDate: new Date() }
    const { dStartDate, dEndDate } = dateRange

    query = { ...query, attributes: [['ePaymentGateway', 'eTitle'], [fn('sum', col('nCash')), 'nValue']] }
    query.where = { ...query.where, ePaymentGateway: { [Op.ne]: '' }, [Op.and]: [{ dCreatedAt: { [Op.gte]: dStartDate } }, { dCreatedAt: { [Op.lt]: dEndDate } }] }

    const data = await UserDepositModel.findAll(query)

    callback(null, { data: JSON.stringify(data) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

/**
 * get total count of deposit where perticuler promo applied and count of user deposit with perticuler promo
 * @returns  {Object} { allCount, count }
 */
async function countDepositPromo(call, callback) {
  try {
    let query
    if (call.request.query) {
      query = JSON.parse(call.request.query)
    } else {
      return callback(null, { data: '' })
    }
    const { sPromocode, iUserId } = query

    await db.sequelize.transaction(async (t) => {
      const [{ count: allCount }, { count }] = await Promise.all([
        UserDepositModel.findAndCountAll({ where: { sPromocode, ePaymentStatus: { [Op.in]: ['P', 'S'] } } }, { transaction: t, lock: true }),
        UserDepositModel.findAndCountAll({ where: { sPromocode, iUserId, ePaymentStatus: { [Op.in]: ['P', 'S'] } } }, { transaction: t, lock: true })
      ])
      const data = { allCount, count }
      callback(null, { data: JSON.stringify(data) })
    })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

module.exports = {
  findDeposit,
  findAllDeposit,
  countDeposit,
  findTotalCashDeposit,
  getDepositOfPG,
  getDepositOfDateRange,
  getDepositOfPgInDateRange,
  countDepositPromo

}
