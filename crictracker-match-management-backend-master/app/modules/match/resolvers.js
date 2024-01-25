const { fetchMatchData, fetchScorecardData, fetchPlayer, listFantasyPlayer, listTeam, fetchVenues, fetchFixuresData, listFantasyMatch, fetchSeries, fetchSeriesStatsTypes, fetchSeriesStats, fetchMiniScorecardData, fetchFullScorecardData, fetchLiveInningsData, fetchPlayersFromApi, listPlayer, resolveSeries, getLiveMatches, listAllFixtures, getPlayerSearch, getTeamSearch, listMatchSquad, getMatchBySlug, getPlayerByIdFront, getTeamByIdFront, resolveShortTeam, resolveShortPlayer, resolveShortVenue, getMatchById, listAllFixturesFilter, listSeriesSquad, getTagDetail, resolveMiniScorecard, getFiltersForMatchesFront, listAllFixturesMobile, editMatchImpStatus, dailyHuntWidget, fetchFantasyPlayerStats, getTeamForm, getHeadToHead, getSimilarPlayerById, getRecentMatchesOfPlayer, getComparisonOfPlayers, getRecentMatchesOfTeam, getMatchesBetweenTeams, getMiniScoreCardHeader } = require('./controllers')

const Mutation = {
  editMatchImpStatus
}

const Query = {
  fetchPlayer,
  listFantasyPlayer,
  fetchMatchData,
  fetchScorecardData,
  listTeam,
  fetchVenues,
  fetchFixuresData,
  listFantasyMatch,
  fetchSeries,
  fetchSeriesStatsTypes,
  fetchSeriesStats,
  fetchMiniScorecardData,
  fetchFullScorecardData,
  fetchLiveInningsData,
  fetchPlayersFromApi,
  listPlayer,
  getLiveMatches,
  listAllFixtures,
  getPlayerSearch,
  getTeamSearch,
  listMatchSquad,
  getMatchBySlug,
  getPlayerByIdFront,
  getTeamByIdFront,
  getMatchById,
  listAllFixturesFilter,
  listSeriesSquad,
  getFiltersForMatchesFront,
  listAllFixturesMobile,
  dailyHuntWidget,
  fetchFantasyPlayerStats,
  getTeamForm,
  getHeadToHead,
  getSimilarPlayerById,
  getRecentMatchesOfPlayer,
  getComparisonOfPlayers,
  getRecentMatchesOfTeam,
  getMatchesBetweenTeams,
  getMiniScoreCardHeader
  // getRecentMatchesOfPlayerMobile
}

const oFetchSeries = {
  oSeo: (series) => {
    return { __typename: 'Seo', iId: series._id }
  },
  __resolveReference: (reference) => {
    return resolveSeries(reference._id)
  },
  oCategory: (series) => {
    if (series?.iCategoryId) {
      return { __typename: 'oSeriesCategory', _id: series.iCategoryId }
    }
  }
}

const LiveInningTeam = {
  oSeo: (team) => {
    return { __typename: 'Seo', iId: team._id }
  }
}

const LiveInningPlayer = {
  oSeo: (player) => {
    return { __typename: 'Seo', iId: player._id }
  }
}

const oShortTeam = {
  __resolveReference: (reference) => {
    return resolveShortTeam(reference._id)
  }
}

const oShortPlayer = {
  __resolveReference: (reference) => {
    return resolveShortPlayer(reference._id)
  }
}

const oShortVenue = {
  __resolveReference: (reference) => {
    return resolveShortVenue(reference._id)
  }
}

const FantasyArticleShort = {
  oDisplayAuthor: (article) => {
    return { __typename: 'subAdmin', _id: article.iAuthorDId }
  },
  oReviewer: (article) => {
    return { __typename: 'subAdmin', _id: article.iReviewerId }
  }
}

const oPlayer = {
  oSeo: (player) => {
    return { __typename: 'Seo', iId: player._id }
  },
  __resolveReference: async (reference) => {
    return await getTagDetail(reference)
  }
}

const oTeams = {
  oSeo: (team) => {
    return { __typename: 'Seo', iId: team._id }
  },
  __resolveReference: async (reference) => {
    return await getTagDetail(reference)
  }
}

const seriesSquadPlayer = {
  oSeo: (player) => {
    return { __typename: 'Seo', iId: player._id }
  }
}

const oMatchDetailsFront = {
  oSeo: (match) => {
    return { __typename: 'Seo', iId: match._id }
  },
  oCategory: (match) => {
    if (match?.iCategoryId) return { __typename: 'oSeriesCategory', _id: match?.iCategoryId }
  },
  aPoll: (match) => {
    const aPoll = []
    if (match?.aPollId) match?.aPollId?.forEach(id => aPoll.push({ __typename: 'poll', _id: id }))
    return aPoll
  }
}

const oAllFixtures = {
  oSeo: (match) => {
    return { __typename: 'Seo', iId: match._id }
  }
}

const oFixuresData = {
  oSeo: (match) => {
    return { __typename: 'Seo', iId: match._id }
  }
}

const LiveInningSeries = {
  oSeo: (series) => {
    return { __typename: 'Seo', iId: series?.iCategoryId ?? series?._id }
  }
}
const MiniScorecard = {
  oSeo: (match) => {
    return { __typename: 'Seo', iId: match.iMatchId }
  },
  oSeriesSeo: (match) => {
    return { __typename: 'Seo', iId: match?.oSeries?.iCategoryId ?? match?.oSeries?._id }
  },
  oSeriesSeos: (match) => {
    return { __typename: 'Seos', iId: match?.oSeries?.iCategoryId ?? match?.oSeries?._id }
  },
  __resolveReference: (reference) => {
    return resolveMiniScorecard(reference.iMatchId)
  }
}

const oPlayerFront = {
  oSeo: (player) => {
    return { __typename: 'Seo', iId: player._id }
  }
}

const oTeamFront = {
  oSeo: (team) => {
    return { __typename: 'Seo', iId: team._id }
  }
}

const oShortMatch = {
  oSeo: (match) => {
    return { __typename: 'Seo', iId: match._id }
  }
}

const oShortSeries = {
  oSeo: (series) => {
    return { __typename: 'Seo', iId: series?.iCategoryId ?? series?._id }
  },
  oCategory: (series) => {
    if (series?.iCategoryId) {
      return { __typename: 'oSeriesCategory', _id: series.iCategoryId }
    }
  }
}

const oPlayerDetails = {
  oSeo: (player) => {
    return { __typename: 'Seo', iId: player._id }
  }
}

const resolvers = {
  Query,
  Mutation,
  oFetchSeries,
  FantasyArticleShort,
  oPlayer,
  seriesSquadPlayer,
  oTeams,
  oMatchDetailsFront,
  oAllFixtures,
  oFixuresData,
  MiniScorecard,
  oPlayerFront,
  oTeamFront,
  oShortTeam,
  oShortPlayer,
  oShortVenue,
  oShortMatch,
  oShortSeries,
  oPlayerDetails,
  LiveInningTeam,
  LiveInningPlayer,
  LiveInningSeries
}

module.exports = resolvers
