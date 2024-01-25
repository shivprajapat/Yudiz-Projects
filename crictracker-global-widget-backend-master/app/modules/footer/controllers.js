const { FooterMenuModel } = require('../../model')
const { CACHE_8 } = require('../../../config')
const cachegoose = require('cachegoose')

const controllers = {}

controllers.getFrontFooter = async (parent, { input }, context) => {
  try {
    const data = await FooterMenuModel.find({ eStatus: 'a' }).sort({ nPriority: 1 }).lean().cache(CACHE_8, 'footerMenu')
    return data
  } catch (error) {
    return error
  }
}

controllers.addFooterMenu = async (parent, { input }, context) => {
  await FooterMenuModel.deleteMany({})
  cachegoose.clearCache('footerMenu')

  await FooterMenuModel.insertMany(input)
  await FooterMenuModel.find({ eStatus: 'a' }).sort({ nPriority: 1 }).lean().cache(CACHE_8, 'footerMenu')
  return 'Footer Menu created Successfully'
}

module.exports = controllers
