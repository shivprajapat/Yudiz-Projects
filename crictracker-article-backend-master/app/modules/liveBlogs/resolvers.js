const { addLiveBlogContent, editLiveBlogContent, deleteLiveBlogContent, listLiveBlogContent, getLiveBlogContent, deleteLiveBlog, listLiveBlogEvents, addLiveBlogEvent, updatePollCount, getLiveBlog, listLiveBlogContentFront, editLiveBlogEvent, bulkDeleteLiveBlogEvent, getLiveBlogEventById, updateMatchScores } = require('./controllers')

const Mutation = {
  addLiveBlogContent,
  editLiveBlogContent,
  editLiveBlogEvent,
  deleteLiveBlogContent,
  deleteLiveBlog,
  addLiveBlogEvent,
  updatePollCount,
  bulkDeleteLiveBlogEvent,
  updateMatchScores
}

const Query = {
  listLiveBlogContent,
  getLiveBlogContent,
  listLiveBlogEvents,
  getLiveBlog,
  listLiveBlogContentFront,
  getLiveBlogEventById
}

const blogEvent = {
  oAuthor: (blogevent) => {
    return { __typename: 'subAdmin', _id: blogevent?.iCreatedBy }
  },
  oMatch: (blogevent) => {
    if (blogevent?.iMatchId) return { __typename: 'MiniScorecard', iMatchId: blogevent?.iMatchId }
  },
  aEditors: (blogevent) => {
    const arrayOfAditors = []
    blogevent?.aEditorsId?.forEach(id => arrayOfAditors.push({ __typename: 'subAdmin', _id: id }))
    return arrayOfAditors
  }
}

const liveBlogContent = {
  oAuthor: (content) => {
    return { __typename: 'subAdmin', _id: content?.iDisplayAuthorId }
  },
  oPoll: (content) => {
    if (!content?.iPollId) return
    return { __typename: 'poll', _id: content?.iPollId }
  }
}

const resolvers = { Mutation, Query, blogEvent, liveBlogContent }

module.exports = resolvers
