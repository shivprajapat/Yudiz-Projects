const { addCMSPage, editCMSPage, bulkUpdateCMSPage, getCMSPageById, listCMSPage, getUserCMSPage, listUserCMSPage } = require('./controllers')

const Mutation = {
  addCMSPage,
  editCMSPage,
  bulkUpdateCMSPage
}

const Query = {
  getCMSPageById,
  listCMSPage,
  listUserCMSPage,
  getUserCMSPage
}

const oCmsData = {
  oSeo: (cms) => {
    return { __typename: 'Seo', iId: cms._id }
  }
}

const resolvers = { Mutation, Query, oCmsData }

module.exports = resolvers
