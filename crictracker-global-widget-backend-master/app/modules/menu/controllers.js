/* eslint-disable no-useless-escape */
const { CACHE_8 } = require('../../../config')
const cachegoose = require('cachegoose')
const { headermenus: HeaderMenuModel } = require('../../model')

const controllers = {}

controllers.getFrontMenu = async (parent, { input }, context) => {
  try {
    const aResults = await HeaderMenuModel.find({
      eStatus: { $ne: 'd' }
    }).sort('nSort').lean().cache(CACHE_8, 'headerMenu')
    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.getMenuTree = async (parent, { input }, context) => {
  try {
    const aResults = await HeaderMenuModel.find({
      eStatus: { $ne: 'd' }
    }).sort('nSort').lean().cache(CACHE_8, 'headerMenu')

    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.addHeaderMenu = async (parent, { input }, context) => {
  await HeaderMenuModel.deleteMany({})
  cachegoose.clearCache('headerMenu')

  await HeaderMenuModel.insertMany(input)
  await HeaderMenuModel.find({
    eStatus: { $ne: 'd' }
  }).sort('nSort').lean().cache(CACHE_8, 'headerMenu')

  return 'Header menu updated successfully'
}

module.exports = controllers
