/* eslint-disable no-useless-escape */
const { SettingModel } = require('../../model')
const { CACHE_10 } = require('../../../config')
const controllers = {}

controllers.fetchAppVersions = async (parent, { input }, context) => {
  const data = await SettingModel.findOne({ sKey: 'APP_VERSION' }, { mValue: 1 }).lean().cache(CACHE_10, 'versionsetting')
  return { oResult: data?.mValue }
}

module.exports = controllers
