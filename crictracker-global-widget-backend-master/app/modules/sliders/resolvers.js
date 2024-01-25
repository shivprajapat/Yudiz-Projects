const { getSlider, getSliderById, getFrontSlider, addSlider, bulkSliderUpdate } = require('./controllers')

const Mutation = {
  addSlider,
  bulkSliderUpdate
}

const Query = {
  getSlider,
  getSliderById,
  getFrontSlider
}

const resolvers = { Query, Mutation }

module.exports = resolvers
