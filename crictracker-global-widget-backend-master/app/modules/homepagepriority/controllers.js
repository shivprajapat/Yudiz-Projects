const { HomePagePriorityModel } = require('../../model')
const controllers = {}

controllers.updateHomePagePriority = async (parent, { input }, context) => {
  try {
    await HomePagePriorityModel.deleteMany({})
    await HomePagePriorityModel.insertMany(input)

    return 'Priority Array Updated Successfully'
  } catch (error) {
    return error
  }
}

controllers.getHomePagePriority = async (parent, { input }, context) => {
  try {
    const data = await HomePagePriorityModel.find().sort({ nSort: 1 }).lean()
    return data
  } catch (error) {
    return error
  }
}

module.exports = controllers
