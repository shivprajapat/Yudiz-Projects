const {
  editFantasyArticle, updateFantasyTipsStatus, editPlayerRating, addMatchOverview, editMatchOverview, getFantasyArticle, getMatchOverview, listFantasyArticle, createFantasyArticle, pickFantasyArticle, editFantasyDisplayAuthor, createFantasyArticleComment, listFantasyArticleComment, deleteFantasyArticle, copyFantasyArticle, getFantasyTipsFront, getMatchInfoFront, listFrontFantasyArticle, getFrontFantasyArticle, listMatchFantasyTipsFront, getPreviewFantasyArticleFront, getOverviewFront, getAuthorFantasyArticles, getMatchOverviewFront, updateFantasyArticleClap, getUserFantasyArticleClap, listFantasyPlayersInfo, resolveFantasyArticle, updateFantasyArticleStatus, listFrontTagCategoryFantasyArticle
  , getRelatedFantasyStories, updatePickFantasyArticleData, getFantasyArticleTotalClaps, updateFantasyArticleViewCount, updateFantasyPlayersList
} = require('./controllers')

const Mutation = {
  editFantasyArticle,
  updateFantasyTipsStatus,
  editPlayerRating,
  addMatchOverview,
  editMatchOverview,
  createFantasyArticle,
  pickFantasyArticle,
  editFantasyDisplayAuthor,
  createFantasyArticleComment,
  deleteFantasyArticle,
  copyFantasyArticle,
  updateFantasyArticleClap,
  updateFantasyArticleStatus,
  updatePickFantasyArticleData,
  updateFantasyArticleViewCount,
  updateFantasyPlayersList
}

const Query = {
  getFantasyArticle,
  getMatchOverview,
  listFantasyArticle,
  listFantasyArticleComment,
  getFantasyTipsFront,
  getMatchInfoFront,
  listMatchFantasyTipsFront,
  listFrontFantasyArticle,
  getFrontFantasyArticle,
  getPreviewFantasyArticleFront,
  getOverviewFront,
  getAuthorFantasyArticles,
  getMatchOverviewFront,
  getUserFantasyArticleClap,
  listFantasyPlayersInfo,
  listFrontTagCategoryFantasyArticle,
  getRelatedFantasyStories,
  getFantasyArticleTotalClaps
}

const FantasyArticle = {
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
  oCategory: (article) => {
    return { __typename: 'oSimpleCategory', _id: article.iCategoryId }
  },
  aSeriesCategory: (article) => {
    if (!article?.aSeries?.length) return
    const data = article.aSeries.map(s => {
      return { __typename: 'oSeriesCategory', _id: s._id }
    })
    return data
  },
  aPlayerTag: (article) => {
    if (!article?.aPlayer?.length) return
    const data = article.aPlayer.map(p => {
      return { __typename: 'tagData', _id: p._id }
    })
    return data
  },
  aTeamTag: (article) => {
    if (!article?.aTeam?.length) return
    const data = article.aTeam.map(t => {
      return { __typename: 'tagData', _id: t._id }
    })
    return data
  },
  aVenueTag: (article) => {
    if (!article?.aVenue?.length) return
    const data = article.aVenue.map(v => {
      return { __typename: 'tagData', _id: v._id }
    })
    return data
  },
  aTagsData: (article) => {
    if (!article?.aTags?.length) return
    const data = article.aTags.map(t => {
      return { __typename: 'tagData', _id: t._id }
    })
    return data
  },
  aPoll: (article) => {
    const aPoll = []
    article?.aPollId?.forEach(id => aPoll.push({ __typename: 'poll', _id: id }))
    return aPoll
  }
}

const FantasyArticleComment = {
  oSender: (comment) => {
    return { __typename: 'subAdmin', _id: comment.iSenderId }
  },
  oReceiver: (comment) => {
    return { __typename: 'subAdmin', _id: comment.iReceiverId }
  }
}

const oFantasyArticleFront = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article._id }
  },
  oDisplayAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorDId }
  },
  oCategory: (article) => {
    return { __typename: 'oSimpleCategory', _id: article.iCategoryId }
  },
  aSeriesCategory: (article) => {
    if (!article?.aSeries?.length) return
    const data = article.aSeries.map(s => {
      return { __typename: 'oSeriesCategory', _id: s._id }
    })
    return data
  },
  aPlayerTag: (article) => {
    if (!article?.aPlayer?.length) return
    const data = article.aPlayer.map(p => {
      return { __typename: 'tagData', _id: p._id }
    })
    return data
  },
  aTeamTag: (article) => {
    if (!article?.aTeam?.length) return
    const data = article.aTeam.map(t => {
      return { __typename: 'tagData', _id: t._id }
    })
    return data
  },
  aVenueTag: (article) => {
    if (!article?.aVenue?.length) return
    const data = article.aVenue.map(v => {
      return { __typename: 'tagData', _id: v._id }
    })
    return data
  },
  aTagsData: (article) => {
    if (!article?.aTags?.length) return
    const data = article.aTags.map(t => {
      return { __typename: 'tagData', _id: t._id }
    })
    return data
  },
  aPoll: (article) => {
    const aPoll = []
    article?.aPollId?.forEach(id => aPoll.push({ __typename: 'poll', _id: id }))
    return aPoll
  }
}

const frontFantasyArticle = {
  oSeo: (article) => {
    return { __typename: 'Seo', iId: article._id }
  },
  oDisplayAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorDId }
  },
  oCategory: (article) => {
    return { __typename: 'oSimpleCategory', _id: article.iCategoryId }
  },
  aSeriesCategory: (article) => {
    if (!article?.aSeries?.length) return
    const data = article.aSeries.map(s => {
      return { __typename: 'oSeriesCategory', _id: s._id }
    })
    return data
  },
  aPlayerTag: (article) => {
    if (!article?.aPlayer?.length) return
    const data = article.aPlayer.map(p => {
      return { __typename: 'tagData', _id: p._id }
    })
    return data
  },
  aTeamTag: (article) => {
    if (!article?.aTeam?.length) return
    const data = article.aTeam.map(t => {
      return { __typename: 'tagData', _id: t._id }
    })
    return data
  },
  aVenueTag: (article) => {
    if (!article?.aVenue?.length) return
    const data = article.aVenue.map(v => {
      return { __typename: 'tagData', _id: v._id }
    })
    return data
  },
  aTagsData: (article) => {
    if (!article?.aTags?.length) return
    const data = article.aTags.map(t => {
      return { __typename: 'tagData', _id: t._id }
    })
    return data
  },
  aPoll: (article) => {
    const aPoll = []
    article?.aPollId?.forEach(id => aPoll.push({ __typename: 'poll', _id: id }))
    return aPoll
  },
  __resolveReference: (reference) => {
    return resolveFantasyArticle(reference._id)
  }
}

const oFantasyMatchOverview = {
  oSeo: (overview) => {
    return { __typename: 'Seo', iId: overview._id }
  }
}

const oListMatchFantasyTips = {
  oSeo: (match) => {
    return { __typename: 'Seo', iId: match._id }
  }
}

const oShortFantasyTips = {
  oSeo: (fantasyTips) => {
    return { __typename: 'Seo', iId: fantasyTips._id }
  }
}

const oCricPrediction = {
  oSeo: (overview) => {
    return { __typename: 'Seo', iId: overview._id }
  }
}

const oGetFantasyTipsFrontResponse = {
  oSeo: (article) => {
    if (article?._id) {
      return { __typename: 'Seo', iId: article._id }
    }
  }
}

const oFrontPlayer = {
  oSeo: (player) => {
    if (player?._id) {
      return { __typename: 'Seo', iId: player._id }
    }
  }
}

const fantasyArticleList = {
  oCategory: (article) => {
    return { __typename: 'oSimpleCategory', _id: article.iCategoryId }
  }
}

const resolvers = { Mutation, Query, FantasyArticle, FantasyArticleComment, oFantasyArticleFront, frontFantasyArticle, oFantasyMatchOverview, oListMatchFantasyTips, oShortFantasyTips, oCricPrediction, oGetFantasyTipsFrontResponse, oFrontPlayer, fantasyArticleList }

module.exports = resolvers
