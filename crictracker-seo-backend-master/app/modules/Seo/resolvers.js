const { generateSlugs, insertSeo, addSeo, updateSeo, editSeo, getSeoById, changeSeoPicture, getSeoBySlug, listSeo, bulkSeoUpdate, getSeoData, getCategoryIdBySlug, getSeoByIdAdmin, oSeoById, deleteSocialImage, getSeriesCustomPages, getSeosBySlug, oSeo, getSeosById, getSeos } = require('./controllers')

const Mutation = {
  insertSeo, editSeo, changeSeoPicture, bulkSeoUpdate, addSeo, updateSeo, deleteSocialImage
}

const Query = {
  generateSlugs, listSeo, getSeoBySlug, getSeoData, getSeoById, getCategoryIdBySlug, getSeoByIdAdmin, oSeoById, getSeriesCustomPages, getSeosBySlug, oSeo, getSeosById
}

const Seo = {
  __resolveReference: async (reference, context, info) => {
    // create DataLoader instance by calling inner function of closure
    if (!context.dataLoader) {
      context.dataLoader = context.dataLoaders.seoDataLoader.getDataLoader(info)
    }

    // batch seo ids
    // return getSeo(reference.iId)
    return context.dataLoader.load(reference.iId)
  }
}

const Seos = {
  __resolveReference: (reference) => {
    return getSeos(reference.iId)
  }
}

const oCustomSeo = {
  oSubAdmin: (admin) => {
    return { __typename: 'subAdmin', _id: admin.iUpdatedBy }
  }
}

const resolvers = {
  Query,
  Mutation,
  Seo,
  oCustomSeo,
  Seos
}

module.exports = resolvers
