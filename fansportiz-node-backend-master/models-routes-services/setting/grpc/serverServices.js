const SettingModel = require('../model')
const { CACHE_2 } = require('../../../config/config')
const { handleCatchError } = require('../../../helper/utilities.services')

async function findSetting(call, callback) {
  try {
    const query = call.request.query ? JSON.parse(call.request.query) : {}
    const projection = call.request.projection ? JSON.parse(call.request.projection) : {}

    const setting = await SettingModel.findOne({ ...query, eStatus: 'Y' }, projection).lean().cache(CACHE_2, `setting:${query.sKey}`)

    callback(null, { data: JSON.stringify(setting) })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

async function getCurrencySymbol(call, callback) {
  try {
    const setting = await SettingModel.findOne({ sKey: 'CURRENCY' }, { sLogo: 1 }).lean().cache(CACHE_2, 'setting:CURRENCY')
    const sLogo = setting?.sLogo || '₹'

    callback(null, { sLogo })
  } catch (error) {
    callback(null, { sLogo: '₹' })
    handleCatchError(error)
  }
}

module.exports = {
  findSetting,
  getCurrencySymbol
}
