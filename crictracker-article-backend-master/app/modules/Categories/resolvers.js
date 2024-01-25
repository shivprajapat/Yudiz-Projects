const { addCategory, editCategory, updateCategoryStatus, deleteCategory, getCategory, getCategoryById, bulkCategoryUpdate, resolveCategory, getCategoryByIdFront, listSeriesCategoryMiniScorecard, getCategoryCount, listSeriesCTArchive, listCategoryFront, getApiSeriesCategory } = require('./controllers')

const Mutation = {
  addCategory,
  editCategory,
  updateCategoryStatus,
  bulkCategoryUpdate,
  deleteCategory
}

const Query = {
  getCategory,
  getCategoryById,
  getCategoryByIdFront,
  listSeriesCategoryMiniScorecard,
  getCategoryCount,
  listSeriesCTArchive,
  listCategoryFront,
  getApiSeriesCategory
}

const categoryGetData = {
  oSeo: (category, input, { eSubType }) => {
    return { __typename: 'Seo', iId: category._id, eSubType }
  },
  oSubAdmin: (category) => {
    return { __typename: 'subAdmin', _id: category.iSubmittedBy }
  },
  oSeries: (category) => {
    return { __typename: 'oFetchSeries', _id: category.iSeriesId }
  }

}
const ParentCategory = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  },
  oSubAdmin: (category) => {
    return { __typename: 'subAdmin', _id: category.iSubmittedBy }
  },
  oSeries: (category) => {
    return { __typename: 'oFetchSeries', _id: category.iSeriesId }
  }
}

const oSimpleCategory = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  },
  oSubAdmin: (category) => {
    return { __typename: 'subAdmin', _id: category.iSubmittedBy }
  },
  __resolveReference: (reference) => {
    return resolveCategory(reference._id)
  }
}

const oSeriesCategory = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  },
  oSubAdmin: (category) => {
    return { __typename: 'subAdmin', _id: category.iSubmittedBy }
  },
  __resolveReference: (reference) => {
    return resolveCategory(reference._id)
  }
}

const oTournamentCategory = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  },
  oAuthor: (category) => {
    return { __typename: 'subAdmin', _id: category.iAuthorId }
  },
  __resolveReference: (reference) => {
    return resolveCategory(reference._id)
  }
}

const oCategoryFront = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  },
  oSeries: (category) => {
    return { __typename: 'oFetchSeries', _id: category.iSeriesId }
  }
}

const oCategoryDetail = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  }
}

const oParentCategoryFront = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category._id }
  },
  oSeries: (category) => {
    return { __typename: 'oFetchSeries', _id: category.iSeriesId }
  }
}

const oSeriesMiniScorecard = {
  oSeo: (category) => {
    return { __typename: 'Seo', iId: category.iMatchId }
  }

}

const resolvers = { Mutation, Query, categoryGetData, oSimpleCategory, oSeriesCategory, oTournamentCategory, ParentCategory, oCategoryFront, oParentCategoryFront, oSeriesMiniScorecard, oCategoryDetail }

module.exports = resolvers
