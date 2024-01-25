const { insertFeedback, deleteFeedback, getFeedbacks, getFeedbackById, bulkFeedbackDelete, getFeedbackQueryType } = require('./controllers')

const Mutation = {
  insertFeedback,
  bulkFeedbackDelete,
  deleteFeedback
}

const Query = {
  getFeedbacks,
  getFeedbackById,
  getFeedbackQueryType
}

const resolvers = { Mutation, Query }

module.exports = resolvers
