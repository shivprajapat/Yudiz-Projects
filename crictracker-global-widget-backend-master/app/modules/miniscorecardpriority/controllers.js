const { MiniScoreCardPriority } = require('../../model')
const controllers = { }

controllers.updateMiniScoreCardPriority = async (parent, { input }, context) => {
  try {
    const insertQueries = []
    input.map(object => insertQueries.push({ insertOne: { document: object } }))
    MiniScoreCardPriority.bulkWrite([
      {
        deleteMany: {
          filter: { }
        }
      },
      ...insertQueries.map(ele => ele)
    ])
    return 'success'
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.getMiniScoreCardPriority = async (parent, { input }, context) => {
  try {
    const aMiniScoreCardPriority = await MiniScoreCardPriority.find({}).sort({ nPriority: 1 }).lean()
    return aMiniScoreCardPriority
  } catch (error) {
    return error
  }
}

module.exports = controllers
