const { addPoll, editPoll, getPollById, getPollByIdRef, updatePollCount, listPoll, bulkDeletePoll, getPollByIdFront } = require('./controllers')

const Mutation = {
  addPoll,
  editPoll,
  updatePollCount,
  bulkDeletePoll
}

const Query = {
  getPollById,
  listPoll,
  getPollByIdFront
}

const poll = {
  __resolveReference: (reference) => {
    return getPollByIdRef(reference)
  }
}

const resolvers = { Mutation, Query, poll }

module.exports = resolvers
