const { claps, articles: ArticleModel } = require('../../model')
const _ = require('../../../global')
const controllers = {}
const cachegoose = require('cachegoose')

controllers.updateArticleClap = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId'])
    if (!body.iArticleId) _.throwError('requiredField', context)
    const { iArticleId } = body

    const { decodedToken } = context

    const query = { iArticleId }

    if (decodedToken) {
      const { iUserId } = decodedToken
      if (!iUserId) _.throwError('notFound', context, 'user')

      query.iUserId = iUserId
    }

    const article = await ArticleModel.findOne({ _id: _.mongify(iArticleId), eState: 'pub' }).lean()
    if (!article) _.throwError('notFound', context, 'article')

    // Here i put fake objectId for storing unauthenticated users clap
    if (!query?.iUserId) query.iUserId = '60b6f7b6ac9fc7178c7a7a7a'

    let userClapCount = 0
    // Update user claps
    const clapQuery = {
      iUserId: query?.iUserId,
      iArticleId
    }

    const clap = await claps.findOne(query).lean()
    if (clap) {
      if (clap.nClapCount >= 5 && clap?.iUserId?.toString() !== '60b6f7b6ac9fc7178c7a7a7a') _.throwError('noClapLeft', context)
      userClapCount = clap.nClapCount + 1
    } else {
      ++userClapCount
    }

    const updateClap = await claps.updateOne(clapQuery, { nClapCount: userClapCount }, { upsert: true, runValidators: true })
    if (!updateClap.acknowledged) _.throwError('somethingWentWrong', context)

    // Update Article claps
    const updateArticleClap = await ArticleModel.updateOne({ _id: article._id }, { $inc: { nClaps: 1 } })
    if (!updateArticleClap.modifiedCount) _.throwError('somethingWentWrong', context)

    cachegoose.clearCache(`article:${article._id}`)

    return _.resolve('successfully', { nTotalClap: userClapCount }, 'articleClapped', context)
  } catch (error) {
    return error
  }
}

controllers.getUserArticleClap = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iArticleId'])
    if (!body.iArticleId) _.throwError('requiredField', context)
    const { iArticleId } = body
    const { decodedToken } = context

    const { iUserId } = decodedToken
    if (!iUserId) _.throwError('notFound', context, 'user')

    const article = await ArticleModel.findOne({ _id: _.mongify(iArticleId), eStatus: { $ne: 'd' }, eState: 'pub' }).lean()

    if (!article) _.throwError('notFound', context, 'article')

    const query = {
      iUserId,
      iArticleId
    }
    let nTotalClap = 0
    const userClaps = await claps.findOne(query, { nClapCount: 1 }).lean()
    if (userClaps) nTotalClap = userClaps.nClapCount
    return { nTotalClap }
  } catch (error) {
    return error
  }
}

controllers.getNewsArticleTotalClaps = async (parent, { input }, context) => {
  const { _id } = input

  const article = await ArticleModel.findOne({ _id, eState: 'pub' }).lean()
  if (!article) _.throwError('notFound', context, 'article')

  return { nTotalClap: article.nClaps }
}

module.exports = controllers
