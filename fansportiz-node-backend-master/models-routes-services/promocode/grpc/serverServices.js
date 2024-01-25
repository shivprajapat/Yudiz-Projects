const PromocodeModel = require('../model')
const PromocodeStatisticServices = require('../statistics/services')
const { handleCatchError } = require('../../../helper/utilities.services')

async function findPromocode(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const projection = call.request.projection ? JSON.parse(call.request.projection) : {}

    const promocode = await PromocodeModel.findOne(query, projection).lean()

    callback(null, { data: JSON.stringify(promocode) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function createPromocodeStatistics(call, callback) {
  try {
    const data = call.request.data ? JSON.parse(call.request.data) : {}

    await PromocodeStatisticServices.logStats(data)

    callback(null, null)
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

module.exports = {
  findPromocode,
  createPromocodeStatistics
}
