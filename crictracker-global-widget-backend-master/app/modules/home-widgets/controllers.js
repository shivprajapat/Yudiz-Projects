/* eslint-disable no-useless-escape */
const { WidgetPriorityModel } = require('../../model')

const controllers = {}

controllers.getHomeWidgets = async (parent, { input }, context) => {
  try {
    const homeWidgets = await WidgetPriorityModel.find({}).sort({ nPriority: 1 }).lean()
    return homeWidgets
  } catch (error) {
    return error
  }
}

controllers.updateHomeWidgets = async (parent, { input }, context) => {
  try {
    WidgetPriorityModel.bulkWrite([
      {
        deleteMany: {
          filter: { }
        }
      },
      ...input.map(object => ({ insertOne: { document: object } }))
    ])

    return 'Widget priority updated successfully'
  } catch (error) {
    return error
  }
}

module.exports = controllers
