const { createArticle, createArticleComment, editArticle, getArticle, getArticleCounts, pickArticle, listArticle, listArticleComment, editDisplayAuthor, getArticleFront, listUserArticle, listUserTagArticle, getHomePageArticle, listSimpleCategoryArticle, getPreviewArticleFront, getArticleSearch, getRssFeed, getAuthorArticles, listSeriesArticlesVideosFront, listSimpleCategoryArticlesVideosFront, updateArticleStatus, getArticleByTeam, getRelatedStories, getTopArticles, updatePickArticleData, randomArticles, getArticleById, updateNewsArticleViewsCount } = require('./controllers')

const Mutation = {
  createArticle,
  createArticleComment,
  editArticle,
  pickArticle,
  editDisplayAuthor,
  updateArticleStatus,
  updatePickArticleData,
  updateNewsArticleViewsCount
}

const Query = {
  getArticle,
  listArticle,
  getArticleCounts,
  listArticleComment,
  getArticleFront,
  listUserArticle,
  listUserTagArticle,
  getHomePageArticle,
  listSimpleCategoryArticle,
  getPreviewArticleFront,
  getArticleSearch,
  getRssFeed,
  listSeriesArticlesVideosFront,
  listSimpleCategoryArticlesVideosFront,
  getAuthorArticles,
  getArticleByTeam,
  getRelatedStories,
  getTopArticles,
  randomArticles,
  getArticleById
}

const Article = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article._id }
  },
  oAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorId }
  },
  oDisplayAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorDId }
  },
  oReviewer: (article) => {
    if (!article.iReviewerId) return
    return { __typename: 'subAdmin', _id: article.iReviewerId }
  },
  aPoll: (article) => {
    const aPoll = []
    if (article?.aPollId) article?.aPollId?.forEach(id => aPoll.push({ __typename: 'poll', _id: id }))
    return aPoll
  }
}

const getHomePage = {
  oScore: (article) => {
    if (article?.oScore?.iMatchId) return { type: 'MiniScorecard', iMatchId: article?.oScore?.iMatchId }
  }
}

const Comment = {
  oSender: (comment) => {
    return { __typename: 'subAdmin', _id: comment.iSenderId }
  },
  oReceiver: (comment) => {
    return { __typename: 'subAdmin', _id: comment.iReceiverId }
  }
}

const listArticles = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article._id }
  },
  oAuthorSeo: (article) => {
    return { __typename: 'Seo', iId: article?.iAuthorDId }
  },
  oAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorId }
  },
  oDisplayAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorDId }
  },
  oReviewer: (article) => {
    if (!article.iReviewerId) return
    return { __typename: 'subAdmin', _id: article.iReviewerId }
  }
}

const FrontArticle = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article._id }
  },
  oDisplayAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorDId }
  },
  aPoll: (article) => {
    const aPoll = []
    if (article?.aPollId) article?.aPollId?.forEach(id => aPoll.push({ __typename: 'poll', _id: id }))
    return aPoll
  }
}

const resolvers = { Mutation, Query, Article, listArticles, Comment, FrontArticle, getHomePage }

module.exports = resolvers
