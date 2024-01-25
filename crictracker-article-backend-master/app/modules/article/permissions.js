const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
const { articles, bookmarks: BookmarksModel } = require('../../model')
const moment = require('moment')

const permissions = {}

permissions.isCreateArticleAuthorized = rule('Create Article')(async (parent, { input }, context) => {
  try {
    const { eState } = input
    const { data } = getPermissions(context)
    if (!['p', 't', 'd'].includes(eState)) _.throwError('createArticleInvalidState', context)
    if (!data) _.throwError('createArticleNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('createArticleNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'CREATE_ARTICLE') < 0) _.throwError('createArticleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditArticleAuthorized = rule('Edit Article')(async (parent, { input }, context) => {
  try {
    const { eState, _id } = input
    const { data } = getPermissions(context)
    const { decodedToken } = context
    if (data.eType === 'su') return true
    if (!data) _.throwError('editArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('editArticleNotAuthorized', context)

    const isArticle = await articles.findOne({ _id })
    if (!isArticle) _.throwError('notFound', context, 'article')

    const { iAdminId } = decodedToken

    if (eState === 'pub' || eState === 's' || (isArticle.eState === 'pub' && eState === 'pub')) {
      if ((data.aPermissions.findIndex(ele => ele === 'PUBLISH_ARTICLE') < 0) && (data.aPermissions.findIndex(ele => ele === 'PUBLISH_SAVE_CHANGES') < 0)) _.throwError('publishArticleNotAuthorized', context)
    } else if (eState === 'cr' || eState === 'r') {
      if (isArticle.eState === 'cr') {
        if (data.aPermissions.findIndex(ele => ele === 'EDIT_ARTICLE') < 0) _.throwError('editArticleNotAuthorized', context)
      } else if (data.aPermissions
        .findIndex(ele => ele === 'PICK_ARTICLE') < 0) _.throwError('reviewArticleNotAuthorized', context)
    } else if (eState === 'd' || eState === 'p') {
      if ((data.aPermissions.findIndex(ele => ele === 'EDIT_ARTICLE') < 0) && (data.aPermissions.findIndex(ele => ele === 'CREATE_ARTICLE') < 0)) _.throwError('editArticleNotAuthorized', context)
    } else if (eState === 't') {
      if ((data.aPermissions
        .findIndex(ele => ele === 'DELETE_ARTICLE') < 0) && (isArticle?.iAuthorId.toString() !== iAdminId) && (isArticle?.iReviewerId.toString() !== iAdminId)) _.throwError('deleteArticleNotAuthorized', context)
    } else if (eState === 'cs') {
      if (!isArticle?.iReviewerId && !isArticle?.dPublishDate) _.throwError('somethingWentWrong', context)
      if ((data.aPermissions.findIndex(ele => ele === 'EDIT_ARTICLE') < 0) && (isArticle?.iAuthorId.toString() !== iAdminId)) _.throwError('editArticleNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

permissions.isPickArticleAuthorized = rule('Pick Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true

    const { eType } = input

    if (!data) _.throwError('pickArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('pickArticleNotAuthorized', context)

    if (eType === 'p') {
      if (data.aPermissions.findIndex(ele => ele === 'PICK_ARTICLE') < 0) _.throwError('pickArticleNotAuthorized', context)
    }
    if (eType === 'o') {
      if (data.aPermissions.findIndex(ele => ele === 'OVERTAKE_ARTICLE') < 0) _.throwError('overtakeArticleNotAuthorized', context)
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isListArticleAuthorized = rule('List Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listArticleNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_ARTICLE') < 0) _.throwError('listArticleNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isGetArticleAuthorized = rule('get Article')(async (parent, { input }, context) => {
  try {
    const { _id } = input
    const { decodedToken } = context
    const { iAdminId } = decodedToken

    const { data } = getPermissions(context)
    if (!data) _.throwError('getArticleNotAuthorized', context)
    if (data.eType === 'su') return true
    if (!data.aPermissions) _.throwError('getArticleNotAuthorized', context)

    const article = await articles.findOne({ _id }).lean()
    if (!article) _.throwError('notFound', context, 'article')

    if (article.eState === 'd' && article.iAuthorId.toString() !== iAdminId) _.throwError('readArticleNotAuthorized', context)

    return true
  } catch (error) {
    console.log(error)
    return error
  }
})

permissions.isListArticleCommentAuthorized = rule('list Article Comment')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    const { iArticleId } = input
    const { decodedToken } = context
    if (!iArticleId) _.throwError('requiredField', context)

    const { iAdminId } = decodedToken

    if (data.eType === 'su') return true
    if (!data) _.throwError('listArticleCommentNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listArticleCommentNotAuthorized', context)
    if ((data.aPermissions.findIndex(ele => ele === 'CREATE_ARTICLE') < 0) && (data.aPermissions.findIndex(ele => ele === 'PICK_ARTICLE') < 0)) _.throwError('listArticleCommentNotAuthorized', context)

    const article = await articles.findOne({ _id: iArticleId })
    if (!article) _.throwError('notFound', context, 'article')

    if ((article?.iAuthorId?.toString() !== iAdminId) && (article?.iReviewerId?.toString() !== iAdminId)) _.throwError('listArticleCommentNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isChangeDisplayAuthorAuthorized = rule('Change display author')(async (parent, { input }, context) => {
  try {
    const { data, isError, error } = await getPermissions(context)
    const { iArticleId, iAuthorDId } = input
    if (!iArticleId) _.throwError('requiredField', context)
    if (!iAuthorDId) _.throwError('requiredField', context)

    if (isError) return error
    if (data?.eType === 'su') return true
    if (!data) _.throwError('displayAuthorChangeNotAuthorized', context)
    if (!data?.aPermissions) _.throwError('displayAuthorChangeNotAuthorized', context)
    if ((data?.aPermissions.findIndex(ele => ele === 'DISPLAY_AUTHOR_CHANGE_ARTICLE') < 0)) _.throwError('displayAuthorChangeNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isPreviewArticleAuthorized = rule('preview article')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

    if ((decodedToken?.iAdminId) && (['su', 'sb'].includes(decodedToken?.eType))) {
      if (decodedToken?.eType === 'su') return true

      if (!decodedToken?.aPermissions?.length) _.throwError('previewArticleNotAuthorized', context)
      if ((decodedToken.aPermissions.findIndex(ele => ele === 'LIST_ARTICLE') < 0)) _.throwError('previewArticleNotAuthorized', context)
    } else {
      // ga - guest article
      if (!decodedToken?.eType || decodedToken.eType !== 'ga' || (moment().unix() > decodedToken.exp)) _.throwError('previewArticleNotAuthorized', context)
    }

    return true
  } catch (error) {
    return error
  }
})

permissions.isArticleBookmarked = rule('Article Bookmarked')(async (parent, { input }, context) => {
  try {
    const { authorization } = context.headers
    const { decodedToken } = context

    if (authorization !== 'undefined' && decodedToken && decodedToken !== 'jwt expired' && decodedToken.iUserId && decodedToken !== 'invalid signature' && decodedToken !== 'jwt malformed') {
      const query = { iUserId: decodedToken.iUserId, eStatus: 'a', iArticleId: input._id }

      const isExist = await BookmarksModel.findOne(query, { _id: 1 }).lean()

      input.bIsBookmarked = !!isExist?._id
      input.iBookmarkedId = input.bIsBookmarked ? isExist._id : null
    }
    return true
  } catch (error) {
    console.log(error)
    return error
  }
})

permissions.isUpdateArticleAuthorized = rule('Delete Article')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true
    if (!data) _.throwError('updateArticleNotAuthorized', context)
    if (!data.aPermissions) _.throwError('updateArticleNotAuthorized', context)

    const { _id, eState } = input
    const article = await articles.findOne({ _id }).lean()
    if (!article) _.throwError('notFound', context, 'article')

    if (article.eState === 't' && eState === 't') _.throwError('articleAlreadyDeleted', context)
    else if (eState === 'd' && !['d', 't'].includes(article.eState)) _.throwError('invalidArticleOperation', context)

    if (['pub'].includes(article.eState) && eState === 't') {
      if (data.aPermissions.findIndex(ele => ele === 'PUBLISH_DELETE_ARTICLE') < 0) _.throwError('updateArticleNotAuthorized', context)
    } else if ((data.aPermissions.findIndex(ele => ele === 'DELETE_ARTICLE') < 0) && eState === 't') _.throwError('updateArticleNotAuthorized', context)
    else if (eState === 'd' && (data.aPermissions.findIndex(ele => ele === 'EDIT_ARTICLE') < 0)) _.throwError('updateArticleNotAuthorized', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isArticlePublished = rule('Article Published')(async (parent, { input }, context) => {
  try {
    const { _id } = input

    const articleState = await articles.findOne({ _id }).lean()

    if (!articleState) _.throwError('notFound', context, 'article')

    if (articleState.eState !== 'pub') _.throwError('notFound', context, 'article')

    return true
  } catch (error) {
    return error
  }
})
module.exports = permissions
