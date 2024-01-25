/* eslint-disable no-useless-escape */
const { updateCounts } = require('../../utils')
const { counts: CountsModel } = require('../../model')

const controllers = {}

controllers.getCountsCareer = async (parent, { input }, context) => {
  try {
    const { eType } = input

    await updateCounts(eType)

    const res = await CountsModel.findOne({ eType }).lean()
    return res
  } catch (error) {
    return error
  }
}

module.exports = controllers
