const { rule } = require('graphql-shield')
const _ = require('../../../global')
const moment = require('moment')
const { getPermissions } = require('../Common/controllers')
const { fantasyarticles: FantasyArticlesModel } = require('../../model')

const permissions = {}

permissions.getPreviewFantasyArticle = rule('preview fantasy article')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if ((decodedToken?.iAdminId) && (['su', 'sb'].includes(decodedToken?.eType))) {
      if (decodedToken?.eType === 'su') return true

      if (!decodedToken?.aPermissions?.length) _.throwError('previewFantasyArticleNotAuthorized', context)
      if ((decodedToken.aPermissions.findIndex(ele => ele === 'FANTASY_LIST_ARTICLE') < 0)) _.throwError('previewFantasyArticleNotAuthorized', context)
    } else {
      // gfa - guest fantasy article
      if (!decodedToken?.eType || decodedToken.eType !== 'gfa' || (moment().unix() > decodedToken.exp)) _.throwError('previewFantasyArticleNotAuthorized', context)
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isEditFantasyArticleAuthorized = rule('Edit Fantasy Article')(async (parent, { input }, context) => {
  try {
    const { eState, _id } = input
    const { data } = getPermissions(context)
    const { decodedToken } = context
    if (data.eType === 'su') return true
    if (!data) _.throwError('editFantasyArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('editFantasyArticleNotAuthorized', context)

    const isArticle = await FantasyArticlesModel.findOne({ _id })
    if (!isArticle) _.throwError('notFound', context, 'fantasyArticle')

    const { iAdminId } = decodedToken

    if (eState === 'pub' || eState === 's' || (isArticle.eState === 'pub' && eState === 'pub')) {
      if ((data.aPermissions.findIndex(ele => ele === 'FANTASY_PUBLISH_ARTICLE') < 0) || (data.aPermissions.findIndex(ele => ele === 'FANTASY_PUBLISH_SAVE_CHANGES') < 0)) _.throwError('publishFantasyArticleNotAuthorized', context)
    } else if (eState === 'cr' || eState === 'r') {
      if (isArticle.eState === 'cr') {
        if (data.aPermissions.findIndex(ele => ele === 'FANTASY_EDIT_ARTICLE') < 0) _.throwError('editFantasyArticleNotAuthorized', context)
      } else if (data.aPermissions
        .findIndex(ele => ele === 'FANTASY_PICK_ARTICLE') < 0) _.throwError('reviewFantasyArticleNotAuthorized', context)
    } else if (eState === 'd' || eState === 'p') {
      if (data.aPermissions.findIndex(ele => ele === 'FANTASY_EDIT_ARTICLE') < 0) _.throwError('editFantasyArticleNotAuthorized', context)
    } else if (eState === 't') {
      if ((data.aPermissions
        .findIndex(ele => ele === 'FANTASY_DELETE_ARTICLE') < 0) && (isArticle?.iAuthorId.toString() !== iAdminId) && (isArticle?.iReviewerId.toString() !== iAdminId)) _.throwError('deleteFantasyArticleNotAuthorized', context)
    } else if (eState === 'cs') {
      if (!isArticle?.iReviewerId && !isArticle.dPublishDate) _.throwError('wentWrong', context)
      if ((data.aPermissions.findIndex(ele => ele === 'FANTASY_EDIT_ARTICLE') < 0) && (isArticle?.iAuthorId.toString() !== iAdminId)) _.throwError('editFantasyArticleNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isMatchOveriewAuthorized = rule('getMatchOveriew')(async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    if (!decodedToken) _.throwError('matchOverViewArticleNotAuthorized', context)
    if (decodedToken?.eType === 'su') return true

    if (!decodedToken?.aPermissions?.length) _.throwError('matchOverViewArticleNotAuthorized', context)
    if (decodedToken?.aPermissions?.findIndex((ele) => ele === 'MATCH_OVERVIEW_FANTASY_ARTICLE') < 0) _.throwError('matchOverViewArticleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.getFantasyArticle = rule('get fantasy article')(async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    if (!decodedToken) _.throwError('getFantasyArticleNotAuthorized', context)
    if (decodedToken?.eType === 'su') return true

    if (!decodedToken?.aPermissions?.length) _.throwError('getFantasyArticleNotAuthorized', context)
    if (decodedToken?.aPermissions?.findIndex((ele) => ele === 'FANTASY_EDIT_ARTICLE') < 0) _.throwError('matchOverViewArticleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isUpdateFantasyArticleAuthorized = rule('Update Fantasy Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (!data) _.throwError('updateArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('updateArticleNotAuthorized', context)

    const { _id, eState } = input
    const article = await FantasyArticlesModel.findOne({ _id }).lean()
    if (!article) _.throwError('notFound', context, 'fantasyarticle')

    if (article.eState === 't' && eState === 't') _.throwError('articleAlreadyDeleted', context)
    else if (eState === 'd' && !['d', 't'].includes(article.eState)) _.throwError('invalidArticleOperation', context)

    const platformExist = await FantasyArticlesModel.countDocuments({ iMatchId: _.mongify(article.iMatchId), eState: { $nin: ['t', 'r'] }, ePlatformType: article?.ePlatformType }).lean()
    if (platformExist) _.throwError('platformExist', context)

    if (data.eType === 'su') return true

    if (['pub'].includes(article.eState) && eState === 't') {
      if (data.aPermissions.findIndex(ele => ele === 'FANTASY_PUBLISH_DELETE_ARTICLE') < 0) _.throwError('updateArticleNotAuthorized', context)
    } else if ((data.aPermissions.findIndex(ele => ele === 'FANTASY_DELETE_ARTICLE') < 0) && eState === 't') _.throwError('updateArticleNotAuthorized', context)
    else if (eState === 'd' && (data.aPermissions.findIndex(ele => ele === 'FANTASY_EDIT_ARTICLE') < 0)) _.throwError('updateArticleNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isListFantasyArticleAuthorized = rule('List Fantasy Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listFantasyArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listFantasyArticleNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'FANTASY_LIST_ARTICLE') < 0) _.throwError('listFantasyArticleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListFantasyArticleCommentAuthorized = rule('list Fantasy Article Comment')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { iArticleId } = input
    const { decodedToken } = context
    if (!iArticleId) _.throwError('requiredField', context)

    const { iAdminId } = decodedToken

    if (data.eType === 'su') return true
    if (!data) _.throwError('listFantasyArticleCommentNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listFantasyArticleCommentNotAuthorized', context)
    if ((data.aPermissions.findIndex(ele => ele === 'FANTASY_CREATE_ARTICLE') < 0) && (data.aPermissions.findIndex(ele => ele === 'FANTASY_PICK_ARTICLE') < 0)) _.throwError('listFantasyArticleCommentNotAuthorized', context)

    const article = await FantasyArticlesModel.findOne({ _id: iArticleId })
    if (!article) _.throwError('notFound', context, 'fantasyarticle')

    if ((article?.iAuthorId?.toString() !== iAdminId) && (article?.iReviewerId?.toString() !== iAdminId)) _.throwError('listFantasyArticleCommentNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isCreateFantasyArticleAuthorized = rule('Create Fantasy Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (!data) _.throwError('createFantasyArticleNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('createFantasyArticleNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'FANTASY_CREATE_ARTICLE') < 0) _.throwError('createFantasyArticleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isPickFantasyArticleAuthorized = rule('Pick Fantasy Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true

    const { eType } = input

    if (!data) _.throwError('pickFantasyArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('pickFantasyArticleNotAuthorized', context)

    if (eType === 'p') {
      if (data.aPermissions.findIndex(ele => ele === 'FANTASY_PICK_ARTICLE') < 0) _.throwError('pickFantasyArticleNotAuthorized', context)
    }
    if (eType === 'o') {
      if (data.aPermissions.findIndex(ele => ele === 'FANTASY_OVERTAKE_ARTICLE') < 0) _.throwError('overtakeFantasyArticleNotAuthorized', context)
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isChangeFantasyDisplayAuthorAuthorized = rule('Change Fantasy display author')(async (parent, { input }, context) => {
  try {
    const { data, isError, error } = await getPermissions(context)
    const { iArticleId, iAuthorDId } = input
    if (!iArticleId) _.throwError('requiredField', context)
    if (!iAuthorDId) _.throwError('requiredField', context)

    if (isError) return error
    if (data?.eType === 'su') return true
    if (!data) _.throwError('displayFantasyAuthorChangeNotAuthorized', context)
    if (!data?.aPermissions) _.throwError('displayFantasyAuthorChangeNotAuthorized', context)
    if ((data?.aPermissions.findIndex(ele => ele === 'FANTASY_DISPLAY_AUTHOR_CHANGE_ARTICLE') < 0)) _.throwError('displayFantasyAuthorChangeNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
